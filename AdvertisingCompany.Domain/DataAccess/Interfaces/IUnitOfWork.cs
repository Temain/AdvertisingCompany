using AdvertisingCompany.Domain.DataAccess.Repositories;

namespace AdvertisingCompany.Domain.DataAccess.Interfaces
{
    public interface IUnitOfWork
    {
        GenericRepository<TEntity> Repository<TEntity>() where TEntity : class;

        // IStudentRepository StudentRepository { get; }

        void Save();
        void Dispose(bool disposing);
        void Dispose();
    }
}