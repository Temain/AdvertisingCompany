using AutoMapper;

namespace AdvertisingCompany.Web.Models.Mapping
{
    public interface IHaveCustomMappings
    {
        void CreateMappings(IConfiguration configuration);
    }
}
