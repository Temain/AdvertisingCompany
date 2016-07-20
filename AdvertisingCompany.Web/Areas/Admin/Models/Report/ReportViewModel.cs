using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class ReportViewModel : IHaveCustomMappings
    {
        public int ReportId { get; set; }

        [Display(Name = "Примечание")]
        public string Comment { get; set; }

        [Display(Name = "Дата отчета")]
        public string ReportDate { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            //configuration.CreateMap<Report, ReportViewModel>("Report")
            //    .ForMember(m => m.ReportDate, opt => opt.MapFrom(s => s.ReportDate.ToShortDateString()));
        }
    }
}