using System.Collections.Generic;
using AdvertisingCompany.Domain.Context;
using AdvertisingCompany.Domain.DataAccess.Interfaces;

namespace AdvertisingCompany.Domain.DataAccess.Repositories
{
    //public class StudentRepository : GenericRepository<Student>, IExtendedRepository
    //{
    //    public StudentRepository(ApplicationDbContext context) : base(context)
    //    {
    //    }

    //    public IEnumerable<Student> GetStudentsByChair(int chairId)
    //    {
    //        var studentClubs = Context.StudentScienceClubs
    //            .Where(c => c.ChairId == chairId);
            
    //        var studentScienceClubBindings = studentClubs
    //            .SelectMany(c => c.StudentScienceClubBindings);
            
    //        var students = studentScienceClubBindings
    //            .Select(b => b.Student)
    //            .Distinct()
    //            .ToList();

    //        return students;
    //    }
    //}
}
