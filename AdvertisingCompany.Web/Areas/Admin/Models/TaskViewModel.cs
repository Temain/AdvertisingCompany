using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class TaskViewModel : IHaveCustomMappings
    {
        public int TaskId { get; set; }
        public string City { get; set; }
        public string Area { get; set; }
        public string Street { get; set; }
        public string HouseNumber { get; set; }
        public string BuildingNumber { get; set; }
        public string PorchNumber { get;set; }
        public string Date { get; set; }


        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            //configuration.CreateMap<AdvertisingTask, TaskViewModel>("Task")
            //    .ForMember(m => m.TaskId, opt => opt.MapFrom(s => s.TasktId))
            //    .ForMember(m => m.City, opt => opt.MapFrom(s => s.Address.Street.City.CityName))
            //    .ForMember(m => m.Street, opt => opt.MapFrom(s => s.Address.Street.StreetName))
            //    .ForMember(m => m.Area, opt => opt.MapFrom(s => s.Address.Area.AreaName))
            //    .ForMember(m => m.HouseNumber, opt => opt.MapFrom(s => s.Address.HouseNumber))
            //    .ForMember(m => m.BuildingNumber, opt => opt.MapFrom(s => s.Address.BuildingNumber))
            //    .ForMember(m => m.PorchNumber, opt => opt.MapFrom(s => s.Address.PorchNumber))
            //    .ForMember(m => m.Date, opt => opt.MapFrom(s => s.Date.ToShortDateString()));
        }
    }
}