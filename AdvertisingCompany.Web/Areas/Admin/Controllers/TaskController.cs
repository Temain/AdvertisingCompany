using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Controllers;
using AdvertisingCompany.Web.Models;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class TaskController : BaseController
    {
        public TaskController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        //public ActionResult Index()
        //{
        //    var clients = UnitOfWork.Repository<ApplicationUser>()
        //        .Get(x => x.UserName != "Admin")
        //        //.Select(x => new {ClientId = x.Id, FullName = x.FullName + " [" + x.UserName + "]"})
        //        .Select(x => new { ClientId = x.Id, FullName = x.FullNameWithLogin })
        //        .OrderBy(n => n.FullName)
        //        .ToList();
        //    ViewBag.Clients = new SelectList(clients, "ClientId", "FullName");

        //    return View();
        //}

        //[HttpPost]
        //public ActionResult Get(string clientId, int page = 1, int pageSize = 10)
        //{
        //    if (Request.IsAjaxRequest())
        //    {
        //        var tasksList = UnitOfWork.Repository<AdvertisingTask>()
        //            .GetQ(filter: x => x.ClientId == clientId,
        //                 orderBy: o => o.OrderByDescending(x => x.Date));

        //        var tasks = tasksList
        //            .Skip((page - 1) * pageSize)
        //            .Take(pageSize)
        //            .ToList();

        //        var tasksViewModel = Mapper.Map<List<AdvertisingTask>, List<TaskViewModel>>(tasks);
        //        var viewModel = new ListTasksViewModel
        //        {
        //            Tasks = tasksViewModel,
        //            PagesCount = (int)Math.Ceiling((double)tasksList.Count() / pageSize),
        //            SelectedPage = page
        //        };

        //        return Json(viewModel);
        //    }

        //    return null;
        //}

        //[HttpGet]
        //public ActionResult Create(string clientId)
        //{
        //    var client = UnitOfWork.Repository<ApplicationUser>()
        //        .Get(x => x.Id == clientId)
        //        .FirstOrDefault();
        //    if (client == null)
        //    {
        //        throw new HttpException(404, "Клиент с таким идентификатором не найден.");
        //    }

        //    var task = new CreateTaskViewModel { ClientFullName = client.FullName + " [логин: " + client.UserName + "]" };
        //    CreateSelectLists();

        //    return View(task);
        //}

        //[HttpPost]
        //public ActionResult Create(CreateTaskViewModel viewModel)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        CreateSelectLists();
        //        return View(viewModel);
        //    }

        //    var addresses = UnitOfWork.Repository<Address>()
        //        .Get(x => x.AreaId == viewModel.AreaId)
        //        .ToList();
        //    foreach (var address in addresses)
        //    {
        //        var task = new AdvertisingTask
        //        {
        //            AddressId = address.AddressId,
        //            ClientId = viewModel.ClientId,
        //            Date = DateTime.Now
        //        };

        //        UnitOfWork.Repository<AdvertisingTask>().Insert(task);
        //        UnitOfWork.Save();
        //    }

        //    if (addresses.Any())
        //    {
        //        var message = $@"Задание успешно добавлено: размещение рекламных объявлений 
        //            для клиента {"'Ф.И.О. клиента'"} в {"'Район'"} районе города {"'Город'"}";
        //        TempData["Message"] = message;

        //        Logger.Info(message);
        //    }

        //    return RedirectToAction("Index");
        //}

        //private void CreateSelectLists()
        //{
        //    var cities = UnitOfWork.Repository<City>().Get();
        //    ViewBag.Cities = new SelectList(cities, "CityId", "CityName");
        //}
    }
}