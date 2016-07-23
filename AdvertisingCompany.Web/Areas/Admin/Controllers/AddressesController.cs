using System;
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
                    orderBy: o => o.OrderBy(c => c.CreatedAt),
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

            return Ok();
        }


        // PUT: admin/api/addresses/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAddress(EditClientViewModel viewModel)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == viewModel.ClientId && x.DeletedAt == null,
                    includeProperties: "ResponsiblePerson, ApplicationUsers")
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
            }

            Mapper.Map<EditClientViewModel, Client>(viewModel, client);
            client.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Client>().Update(client);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!AddressExists(viewModel.ClientId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: admin/api/addresses
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostAddress(CreateAddressViewModel viewModel)
        {
            var address = Mapper.Map<CreateAddressViewModel, Address>(viewModel);

            var addressExists = UnitOfWork.Repository<Address>()
                .GetQ().Count(x => x.Building.Code == address.Building.Code 
                    && x.Building.LocationName == address.Building.LocationName 
                    && x.DeletedAt == null) > 0;
            if (addressExists)
            {
                ModelState.AddModelError("Shared", "Такой адрес уже присутствует в базе данных.");
            }

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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
            foreach(var locationType in locationTypesForInsert)
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
            for(int index = 0; index < locationProperties.Count(); index++)
            {
                var locationCode = locationProperties[index].PropertyObject.Code;
                var location = UnitOfWork.Repository<Location>()
                    .GetQ(x => x.Code == locationCode)
                    .SingleOrDefault();
                if (location == null)
                {
                    location = locationProperties[index].PropertyObject;
                    var locationType = locationTypesInDb.FirstOrDefault(x => x.LocationTypeName == locationProperties[index].PropertyObject.LocationType.LocationTypeName);
                    if (locationType != null)
                    {
                        location.LocationType = locationType;
                    }

                    var locationLevel = locationLevelsInDb.FirstOrDefault(x => x.LocationLevelName == locationProperties[index].PropertyObject.LocationLevel.LocationLevelName);
                    if (locationLevel != null)
                    {
                        location.LocationLevel = locationLevel;
                    }

                    location.Parent = parent;

                    UnitOfWork.Repository<Location>().Insert(location);
                    UnitOfWork.Save();
                }
                else
                {
                    var addressProperty = typeof(Address).GetProperty(locationProperties[index].PropertyName);
                    addressProperty.SetValue(address, location);
                }

                parent = location;
            }

            UnitOfWork.Repository<Address>().Insert(address);
            UnitOfWork.Save();

            return Ok();
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

            return Ok(client);
        }

        private bool AddressExists(int id)
        {
            return UnitOfWork.Repository<Address>().GetQ().Count(e => e.AddressId == id && e.DeletedAt == null) > 0;
        }
    }
}