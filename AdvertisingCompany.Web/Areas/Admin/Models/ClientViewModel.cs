using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class ClientViewModel : IHaveCustomMappings
    {
        public string UserId { get; set; }
        public string FullName { get; set; }
        public string Login { get; set; }
        public string CreatedAt { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<ApplicationUser, ClientViewModel>("Client")
                .ForMember(m => m.UserId, opt => opt.MapFrom(s => s.Id))
                // .ForMember(m => m.FullName, opt => opt.MapFrom(s => s.ShortName))
                .ForMember(m => m.Login, opt => opt.MapFrom(s => s.UserName))
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt.ToShortDateString()));
        }
    }
}