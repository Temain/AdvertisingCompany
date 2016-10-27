using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AdvertisingCompany.Web.Extensions;
using AdvertisingCompany.Web.Results;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator, Manager")]
    [RoutePrefix("api/admin/addresses")]
    public class AddressesController : BaseApiController
    {
        public AddressesController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/admin/addresses
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListAddressesViewModel))]
        public ListAddressesViewModel GetAddresses(string query = null, int page = 1, int pageSize = 10)
        {
            var addressesList = UnitOfWork.Repository<Address>()
                .GetQ(x => x.DeletedAt == null,
                    orderBy: o => o.OrderByDescending(c => c.CreatedAt),
                    includeProperties: @"Region.LocationLevel, Region.LocationType, District.LocationLevel, District.LocationType, 
                            City.LocationLevel, City.LocationType, Street.LocationLevel, Street.LocationType,
                            Building.LocationLevel, Building.LocationType, Microdistrict");

            if (query != null)
            {
                addressesList = addressesList.Where(x => x.ManagementCompanyName.Contains(query));
            }

            var addresses = addressesList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
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

        // GET: api/admin/addresses/0 (new) or api/admin/addresses/5 (edit)
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
                        includeProperties: @"Region.LocationLevel, Region.LocationType, District.LocationLevel, District.LocationType, 
                            City.LocationLevel, City.LocationType, Street.LocationLevel, Street.LocationType,
                            Building.LocationLevel, Building.LocationType")
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


        // PUT: api/admin/addresses/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutAddress(EditAddressViewModel viewModel)
        {
            var addressInDb = UnitOfWork.Repository<Address>()
                .GetQ(x => x.AddressId == viewModel.AddressId && x.DeletedAt == null,
                    includeProperties: @"Region.LocationLevel, Region.LocationType, Region.Parent, District.LocationLevel, District.Locationtype, District.Parent, 
                        City.LocationType, City.LocationLevel, City.Parent, Street.LocationLevel, Street.LocationType, Street.Parent, 
                        Building.LocationLevel, Building.LocationType, Building.Parent, Microdistrict")
                .SingleOrDefault();
            if (addressInDb == null)
            {
                return BadRequest();
            }

            if (viewModel.Street == null)
            {
                ModelState.AddModelError("viewModel.StreetName", "Выберите улицу из списка.");
            }

            if (viewModel.Building == null)
            {
                ModelState.AddModelError("viewModel.BuildingName", "Выберите номер дома из списка.");
            }

            if (!ModelState.IsValid)
            {
                return new KoValidationResult(ModelState);
            }

            bool addressChanged = addressInDb.Street.Code != viewModel.Street.Id 
                || addressInDb.Street.LocationName != viewModel.Street.Name
                || addressInDb.Building.Code != viewModel.Building.Id 
                || addressInDb.Building.LocationName != viewModel.Building.Name;
            if (addressChanged)
            {
                var addressExists = UnitOfWork.Repository<Address>()
                    .GetQ()
                    .Count(x => x.Building.Code == viewModel.Building.Id
                        && x.Building.LocationName == viewModel.Building.Name
                        && x.DeletedAt == null) > 0;
                if (addressExists)
                {
                    ModelState.AddModelError("Shared", "Такой адрес уже присутствует в базе данных.");
                    return BadRequest(ModelState);
                }
            }

            var addressOnForm = Mapper.Map<EditAddressViewModel, Address>(viewModel);
            CreateOrUpdateAddress(addressOnForm, addressInDb);
            UnitOfWork.Repository<Address>().Update(addressInDb);

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

        // POST: api/admin/addresses
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostAddress(CreateAddressViewModel viewModel)
        {
            if (viewModel.Street == null)
            {
                ModelState.AddModelError("viewModel.StreetName", "Выберите улицу из списка.");
            }

            if (viewModel.Building == null)
            {
                ModelState.AddModelError("viewModel.BuildingName", "Выберите номер дома из списка.");
            }
            else
            {
                var addressExists = UnitOfWork.Repository<Address>()
                    .GetQ()
                    .Count(x => x.Building.Code == viewModel.Building.Id
                        && x.Building.LocationName == viewModel.Building.Name
                        && x.DeletedAt == null) > 0;
                if (addressExists)
                {
                    ModelState.AddModelError("Shared", "Такой адрес уже присутствует в базе данных.");
                    return BadRequest(ModelState);
                }
            }

            if (!ModelState.IsValid)
            {                
                return new KoValidationResult(ModelState);
            }

            var address = Mapper.Map<CreateAddressViewModel, Address>(viewModel);
            CreateOrUpdateAddress(address);
            UnitOfWork.Repository<Address>().Insert(address);
            UnitOfWork.Save();

            Logger.Info("Добавление нового адреса. AddressId={0}", address.AddressId);

            return Ok();
        }

        /// <summary>
        /// Создание / обновление адреса
        /// </summary>
        private void CreateOrUpdateAddress(Address addressOnForm, Address addressInDb = null)
        {
            var locationProperties = typeof(Address)
                .GetProperties()
                .Where(p => p.PropertyType == typeof(Location))
                .Select(x => new { PropertyName = x.Name, PropertyObject = x.GetValue(addressOnForm) as Location })
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
                    .GetQ(x => x.Code == locationOnForm.Code && x.LocationName == locationOnForm.LocationName,
                        includeProperties: "LocationType, LocationLevel, Parent")
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

                var addressIdProperty = typeof(Address).GetProperty(locationProperties[index].PropertyName + "Id");
                var addressProperty = typeof(Address).GetProperty(locationProperties[index].PropertyName);

                if (addressInDb != null)
                {
                    addressIdProperty.SetValue(addressInDb, locationInDb.LocationId);
                    addressProperty.SetValue(addressInDb, locationInDb);
                }
                else
                {
                    addressIdProperty.SetValue(addressOnForm, locationInDb.LocationId);
                    addressProperty.SetValue(addressOnForm, locationInDb);
                }

                parent = locationInDb;
            }

            if(addressInDb != null)
            {
                addressInDb.ManagementCompanyName = addressOnForm.ManagementCompanyName;
                addressInDb.MicrodistrictId = addressOnForm.MicrodistrictId;
                addressInDb.NumberOfEntrances = addressOnForm.NumberOfEntrances;
                addressInDb.NumberOfFloors = addressOnForm.NumberOfFloors;
                addressInDb.NumberOfSurfaces = addressOnForm.NumberOfSurfaces;
                addressInDb.ContractDate = addressOnForm.ContractDate;
                addressInDb.Latitude = addressOnForm.Latitude;
                addressInDb.Longitude = addressOnForm.Longitude;
                addressInDb.UpdatedAt = DateTime.Now;
            }
        }

        // DELETE: api/admin/addresses/5
        [HttpDelete]
        [Route("{id:int}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult DeleteAddress(int id)
        {
            var address = UnitOfWork.Repository<Address>()
                .GetQ(x => x.AddressId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (address == null)
            {
                return NotFound();
            }

            address.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<Address>().Update(address);

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

            return Ok();
        }

        private bool AddressExists(int id)
        {
            return UnitOfWork.Repository<Address>().GetQ().Count(e => e.AddressId == id && e.DeletedAt == null) > 0;
        }
    }
}