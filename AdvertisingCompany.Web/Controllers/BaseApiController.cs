using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using NLog;

namespace AdvertisingCompany.Web.Controllers
{
    public abstract class BaseApiController : ApiController
    {
        protected BaseApiController() { }
       
        protected BaseApiController(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
        }

        public IUnitOfWork UnitOfWork { get; protected set; }

        private Logger _logger;
        public Logger Logger
        {
            get
            {
                if (_logger == null)
                {
                    _logger = LogManager.GetLogger(this.GetType().FullName);
                }
                return _logger;
            }
        }

        private ApplicationUserManager _userManager;
        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? HttpContext.Current.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            set
            {
                _userManager = value;
            }
        }

        private ApplicationRoleManager _roleManager;
        public ApplicationRoleManager RoleManager
        {
            get
            {
                return _roleManager ?? HttpContext.Current.GetOwinContext().Get<ApplicationRoleManager>();
            }
            private set
            {
                _roleManager = value;
            }
        }

        public ApplicationUser UserProfile { get; set; }
        public ApplicationRole UserRole { get; set; }

        protected override void Initialize(HttpControllerContext controllerContext)
        {
            //var userId = User.Identity.GetUserId();
            //if (userId != null)
            //{
            //    UserProfile = UserManager.FindById(userId);
            //}

            base.Initialize(controllerContext);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                if (_userManager != null)
                {
                    _userManager.Dispose();
                    _userManager = null;
                }

                //if (UnitOfWork != null)
                //{
                //    UnitOfWork.Dispose();
                //    UnitOfWork = null;
                //}
            }

            base.Dispose(disposing);
        }
    }
}