﻿using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("admin/api/addresses")]
    public class AddressesController : BaseApiController
    {
        public AddressesController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: admin/api/addresses
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListAddressesViewModel))]
        public ListAddressesViewModel GetAddresses(string query, int page = 1, int pageSize = 10)
        {
            var addressesList = UnitOfWork.Repository<Address>()
                .GetQ(x => x.DeletedAt == null,
                    orderBy: o => o.OrderByDescending(c => c.CreatedAt),
                    includeProperties: @"Region, Region.LocationLevel, Region.LocationType, District, District.LocationLevel, District.LocationType, 
                            City, City.LocationLevel, City.LocationType, Street, Street.LocationLevel, Street.LocationType,
                            Building, Building.LocationLevel, Building.LocationType, Microdistrict");

            if (query != null)
            {
                addressesList = addressesList.Where(x => x.ManagementCompanyName.Contains(query));
            }

            var addresses = addressesList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var addressViewModels = Mapper.Map<List<Address>, List<AddressViewModel>>(addresses);

            var viewModel = new ListAddressesViewModel
            {
                Addresses = addressViewModels,
                PagesCount = (int)Math.Ceiling((double)addressesList.Count() / pageSize),
                Page = page
            };
            return viewModel;
        }

        // GET: admin/api/addresses/0 (new) or admin/api/addresses/5 (edit)
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(CreateAddressViewModel))]
        [ResponseType(typeof(EditClientViewModel))]
        public IHttpActionResult GetAddress(int id)
        {
            var microdistricts = UnitOfWork.Repository<Microdistrict>()
                .Get(orderBy: o => o.OrderBy(p => p.MicrodistrictName))
                .ToList();
            var microdistrictViewModels = Mapper.Map<IEnumerable<Microdistrict>, IEnumerable<MicrodistrictViewModel>>(microdistricts);

            if (id == 0)
            {
                var viewModel = new CreateAddressViewModel();
                viewModel.Microdistricts = microdistrictViewModels;
                return Ok(viewModel);
            }
            else
            {
                var address = UnitOfWork.Repository<Address>()
                    .GetQ(x => x.AddressId == id && x.DeletedAt == null,
                        includeProperties: @"Region, Region.LocationLevel, Region.LocationType, District, District.LocationLevel, District.LocationType, 
                            City, City.LocationLevel, City.LocationType, Street, Street.LocationLevel, Street.LocationType,
                            Building, Building.LocationLevel, Building.LocationType")
                    .SingleOrDefault();
                if (address == null)
                {
                    return BadRequest();
                }

                var viewModel = Mapper.Map<Address, EditAddressViewModel>(address);
                viewModel.Microdistricts = microdistrictViewModels;

                return Ok(viewModel);
            }
        }


        // PUT: admin/api/addresses/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAddress(EditAddressViewModel viewModel)
        {
            var address = UnitOfWork.Repository<Address>()
                .Get(x => x.AddressId == viewModel.AddressId && x.DeletedAt == null,
                    includeProperties: @"Region, Region.LocationLevel, Region.LocationType, 
                        District, Region.LocationLevel, Region.LocationType, City, Region.LocationLevel, Region.LocationType, 
                        Microdistrict, Street, Region.LocationLevel, Region.LocationType, Building, Region.LocationLevel, Region.LocationType")
                .SingleOrDefault();
            if (address == null)
            {
                return BadRequest();
            }

            var addressExists = UnitOfWork.Repository<Address>()
                .GetQ()
                .Count(x => x.Building.Code == viewModel.Building.Id
                   && x.Building.LocationName == viewModel.Building.Name
                   && x.DeletedAt == null) > 0;
            if (addressExists)
            {
                ModelState.AddModelError("Shared", "Такой адрес уже присутствует в базе данных.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Map<EditAddressViewModel, Address>(viewModel, address);
            UpdateAddress(address);
            address.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Address>().Update(address);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(viewModel.AddressId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Обновление адреса. AddressId={0}", viewModel.AddressId);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: admin/api/addresses
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostAddress(CreateAddressViewModel viewModel)
        {
            var addressExists = UnitOfWork.Repository<Address>()
                .GetQ()
                .Count(x => x.Building.Code == viewModel.Building.Id
                    && x.Building.LocationName == viewModel.Building.Name 
                    && x.DeletedAt == null) > 0;
            if (addressExists)
            {
                ModelState.AddModelError("Shared", "Такой адрес уже присутствует в базе данных.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var address = Mapper.Map<CreateAddressViewModel, Address>(viewModel);
            UpdateAddress(address);
            UnitOfWork.Repository<Address>().Insert(address);
            UnitOfWork.Save();

            Logger.Info("Добавление нового адреса. AddressId={0}", address.AddressId);

            return Ok();
        }

        /// <summary>
        /// Создание / обновление адреса
        /// </summary>
        private void UpdateAddress(Address address)
        {
            var locationProperties = typeof(Address)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(Location))
                .Select(x => new { PropertyName = x.Name, PropertyObject = x.GetValue(address) as Location })
                .Where(x => x.PropertyObject != null)
                .ToList();

            var locationTypes = locationProperties.Select(p => p.PropertyObject.LocationType.LocationTypeName);
            var locationTypesInDb = UnitOfWork.Repository<LocationType>()
                .GetQ(x => locationTypes.Contains(x.LocationTypeName))
                .ToList();
            var locationTypesNotInDb = locationTypes.Except(locationTypesInDb.Select(x => x.LocationTypeName));
            var locationTypesForInsert = locationProperties.Where(p => locationTypesNotInDb.Contains(p.PropertyObject.LocationType.LocationTypeName))
                .Select(p => p.PropertyObject.LocationType);
            foreach (var locationType in locationTypesForInsert)
            {
                UnitOfWork.Repository<LocationType>().Insert(locationType);
                UnitOfWork.Save();
            }

            locationTypesInDb = UnitOfWork.Repository<LocationType>()
                .GetQ(x => locationTypes.Contains(x.LocationTypeName))
                .ToList();

            var locationLevels = locationProperties.Select(p => p.PropertyObject.LocationLevel.LocationLevelName);
            var locationLevelsInDb = UnitOfWork.Repository<LocationLevel>()
                .GetQ(x => locationLevels.Contains(x.LocationLevelName))
                .ToList();

            Location parent = null;
            for (int index = 0; index < locationProperties.Count(); index++)
            {
                var locationOnForm = locationProperties[index].PropertyObject;
                var locationInDb = UnitOfWork.Repository<Location>()
                    .GetQ(x => x.Code == locationOnForm.Code && x.LocationName == locationOnForm.LocationName)
                    .SingleOrDefault();
                if (locationInDb == null)
                {
                    locationInDb = locationOnForm;
                    var locationType = locationTypesInDb.FirstOrDefault(x => x.LocationTypeName == locationOnForm.LocationType.LocationTypeName);
                    if (locationType != null)
                    {
                        locationInDb.LocationType = locationType;
                    }

                    var locationLevel = locationLevelsInDb.FirstOrDefault(x => x.LocationLevelName == locationOnForm.LocationLevel.LocationLevelName);
                    if (locationLevel != null)
                    {
                        locationInDb.LocationLevel = locationLevel;
                    }

                    locationInDb.Parent = parent;

                    UnitOfWork.Repository<Location>().Insert(locationInDb);
                    UnitOfWork.Save();
                }
                else
                {
                    var addressProperty = typeof(Address).GetProperty(locationProperties[index].PropertyName);
                    addressProperty.SetValue(address, locationInDb);
                }

                parent = locationInDb;
            }
        }

        // DELETE: admin/api/addresses/5
        [HttpDelete]
        [Route("")]
        [ResponseType(typeof(Client))]
        public IHttpActionResult DeleteAddress(int id)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (client == null)
            {
                return NotFound();
            }

            client.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<Client>().Update(client);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Удаление адреса. AddressId={0}", id);

            return Ok(client);
        }

        private bool AddressExists(int id)
        {
            return UnitOfWork.Repository<Address>().GetQ().Count(e => e.AddressId == id && e.DeletedAt == null) > 0;
        }
    }
}