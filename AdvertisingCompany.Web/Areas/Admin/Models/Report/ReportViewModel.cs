using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class AddressReportViewModel : IHaveCustomMappings
    {
        public int? AddressReportId { get; set; }

        public int AddressId { get; set; }

        public string Comment { get; set; }

        public string ReportDate { get; set; }

        public string ImageName { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            //configuration.CreateMap<Report, ReportViewModel>("Report")
            //    .ForMember(m => m.ReportDate, opt => opt.MapFrom(s => s.ReportDate.ToShortDateString()));
        }
    }
}