using System;
using System.Collections.Generic;
using AdvertisingCompany.Domain.Context;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.DataAccess.Repositories;

namespace AdvertisingCompany.Domain.DataAccess
{
    public class UnitOfWork : IDisposable, IUnitOfWork
    {
        private readonly ApplicationDbContext _context = new ApplicationDbContext();

        private Dictionary<string, object> _repositories;

        //private IStudentRepository _studentRepository;

        //public IStudentRepository StudentRepository
        //{
        //    get
        //    {
        //        if (this._studentRepository == null)
        //        {
        //            this._studentRepository = new StudentRepository(_context);
        //        }
        //        return _studentRepository;
        //    }
        //}

        public GenericRepository<TEntity> Repository<TEntity>() where TEntity : class 
        {
            if (_repositories == null)
            {
                _repositories = new Dictionary<string, object>();
            }

            var type = typeof(TEntity).Name;

            if (!_repositories.ContainsKey(type))
            {
                var repositoryType = typeof(GenericRepository<>);
                var repositoryInstance = Activator.CreateInstance(repositoryType.MakeGenericType(typeof(TEntity)), _context);
                _repositories.Add(type, repositoryInstance);
            }
            return (GenericRepository<TEntity>)_repositories[type];
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        private bool _disposed;

        public virtual void Dispose(bool disposing)
        {
            if (!this._disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }

                this._disposed = true;
            }
        }

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
