using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;

namespace AdvertisingCompany.Web.Controllers
{
    public class TaskController : BaseApiController
    {
        //public TaskController(IUnitOfWork unitOfWork)
        //    : base(unitOfWork)
        //{
        //}

        //// GET: api/Task
        //public IEnumerable<TaskViewModel> GetTasks()
        //{
        //    var tasks = UnitOfWork.Repository<Task>()
        //        .GetQ(
        //            orderBy: o => o.OrderByDescending(s => s.CreatedAt),
        //            includeProperties: "Product, Employee, Employee.Person, Client, Client.Person");

        //    var taskViewModels = Mapper.Map<IEnumerable<Task>, IEnumerable<TaskViewModel>>(tasks);

        //    return taskViewModels;
        //}

        //// GET: api/Task
        //public ListViewModel<TaskViewModel> GetTasks(string query, int page, int pageSize = 10)
        //{
        //    var tasksList = UnitOfWork.Repository<Task>()
        //        .GetQ(
        //            orderBy: o => o.OrderByDescending(s => s.CreatedAt),
        //            includeProperties: "CrashType, Employee, Employee.Person, SpareParts");

        //    if (query != null)
        //    {
        //        tasksList = tasksList.Where(x => x.CarModel.Contains(query));
        //    }

        //    var tasks = tasksList
        //        .Skip((page - 1) * pageSize)
        //        .Take(pageSize)
        //        .ToList();

        //    var taskViewModels = Mapper.Map<IEnumerable<Task>, IEnumerable<TaskViewModel>>(tasks);
        //    var viewModel = new ListViewModel<TaskViewModel>
        //    {
        //        Items = taskViewModels,
        //        ItemsCount = tasksList.Count(),
        //        PagesCount = (int)Math.Ceiling((double)tasksList.Count() / pageSize),
        //        SelectedPage = page
        //    };

        //    return viewModel;
        //}

        //// GET: api/Task/5
        //[ResponseType(typeof(Task))]
        //public IHttpActionResult GetTask(int id)
        //{
        //    var task = UnitOfWork.Repository<Task>()
        //        .Get(x => x.TaskId == id, 
        //            includeProperties: "CrashType, Employee, Employee.Person, SpareParts")
        //        .SingleOrDefault();
        //    if (task == null && id != 0)
        //    {
        //        return NotFound();
        //    }

        //    var taskViewModel = new TaskViewModel();
        //    if (id != 0)
        //    {
        //        taskViewModel = Mapper.Map<Task, TaskViewModel>(task);
        //    }

        //    var spareParts = UnitOfWork.Repository<SparePart>()
        //        .Get(orderBy: o => o.OrderBy(p => p.SparePartName));
        //    taskViewModel.SpareParts = Mapper.Map<IEnumerable<SparePart>, IEnumerable<SparePartViewModel>>(spareParts);

        //    var crashTypes = UnitOfWork.Repository<CrashType>()
        //        .Get(orderBy: o => o.OrderBy(p => p.CrashTypeName));
        //    taskViewModel.CrashTypes = Mapper.Map<IEnumerable<CrashType>, IEnumerable<CrashTypeViewModel>>(crashTypes);

        //    var employees = UnitOfWork.Repository<Employee>()
        //        .Get(orderBy: o => o.OrderBy(p => p.Person.LastName)
        //                .ThenBy(p => p.Person.FirstName),
        //            includeProperties: "Person");
        //    taskViewModel.Employees = Mapper.Map<IEnumerable<Employee>, IEnumerable<EmployeeViewModel>>(employees);

        //    return Ok(taskViewModel);
        //}

        //// PUT: api/Task/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutTask(TaskViewModel viewModel)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var task = UnitOfWork.Repository<Task>()
        //        .Get(x => x.TaskId == viewModel.TaskId)
        //        .SingleOrDefault();
        //    if (task == null)
        //    {
        //        return BadRequest();
        //    }

        //    Mapper.Map<TaskViewModel, Task>(viewModel, task);
        //    task.UpdatedAt = DateTime.Now;

        //    UnitOfWork.Repository<Task>().Update(task);

        //    try
        //    {
        //        UnitOfWork.Save();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!TaskExists(viewModel.TaskId))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        //// POST: api/Task
        //[ResponseType(typeof(Task))]
        //public IHttpActionResult PostTask(TaskViewModel viewModel)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var task = Mapper.Map<TaskViewModel, Task>(viewModel);
        //    var spareParts = UnitOfWork.Repository<SparePart>()
        //        .GetQ(x => viewModel.SparePartIds.Contains(x.SparePartId))
        //        .ToList();
        //    task.SpareParts = spareParts;   

        //    UnitOfWork.Repository<Task>().Insert(task);
        //    UnitOfWork.Save();

        //    return Ok();
        //}

        //// DELETE: api/Task/5
        //[ResponseType(typeof(Task))]
        //public IHttpActionResult DeleteTask(int id)
        //{
        //    Task task = UnitOfWork.Repository<Task>().GetById(id);
        //    if (task == null)
        //    {
        //        return NotFound();
        //    }

        //    UnitOfWork.Repository<Task>().Delete(task);
        //    UnitOfWork.Save();

        //    return Ok(task);
        //}

        //// GET: api/Task/ChartData
        //[HttpGet]
        //[Route("api/Task/ChartData/{year}")]
        //public IHttpActionResult ChartData(int year)
        //{
        //    var result = new List<ChartDataViewModel>();

        //    // Выполненные в текущем году
        //    var tasks = UnitOfWork.Repository<Task>()
        //        .GetQ(filter: x => x.CreatedAt.HasValue && x.CreatedAt.Value.Year == year,
        //            includeProperties: "CrashType, Employee, Employee.Person, SpareParts");
        //    var data = tasks
        //        .GroupBy(g => g.CreatedAt.Value.Month)
        //        .Select(x => new
        //        {
        //            Month = x.Key,
        //            Count = x.Count()
        //        });

        //    var months = Enumerable.Range(1, 12);
        //    var currentYear = months.GroupJoin(data,
        //        m => m,
        //        d => d.Month,
        //        (m, g) => g
        //            .Select(r => new KeyValuePair<int, int>(m, r.Count))
        //            .DefaultIfEmpty(new KeyValuePair<int, int>(m, 0))
        //        )
        //        .SelectMany(g => g)
        //        .Select(x => x.Value);
        //    var currentYearData = new ChartDataViewModel
        //    {
        //        name = year + "г.",
        //        data = currentYear
        //    };
            
        //    // Выполненные в прошлом году
        //    tasks = UnitOfWork.Repository<Task>()
        //        .GetQ(filter: x => x.CreatedAt.HasValue && x.CreatedAt.Value.Year == year - 1,
        //            includeProperties: "CrashType, Employee, Employee.Person, SpareParts");
        //    data = tasks
        //        .GroupBy(g => g.CreatedAt.Value.Month)
        //        .Select(x => new
        //        {
        //            Month = x.Key,
        //            Count = x.Count()
        //        });

        //    months = Enumerable.Range(1, 12);
        //    var previousYear = months.GroupJoin(data,
        //        m => m,
        //        d => d.Month,
        //        (m, g) => g
        //            .Select(r => new KeyValuePair<int, int>(m, r.Count))
        //            .DefaultIfEmpty(new KeyValuePair<int, int>(m, 0))
        //        )
        //        .SelectMany(g => g)
        //        .Select(x => x.Value);
        //    var previousYearData = new ChartDataViewModel
        //    {
        //        name = (year - 1) + "г.",
        //        data = previousYear
        //    };

        //    result.Add(previousYearData);
        //    result.Add(currentYearData);

        //    return Ok(result);          
        //}

        //private bool TaskExists(int id)
        //{
        //    return UnitOfWork.Repository<Task>().GetQ().Count(e => e.TaskId == id) > 0;
        //}
    }
}