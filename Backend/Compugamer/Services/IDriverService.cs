using System.Collections.Generic;
using Compugamer.Data.Models;

namespace Compugamer.Services
{
    public interface IDriverService
    {
        IEnumerable<Driver> GetAll();
        Driver? GetById(int id);
        Driver Add(Driver driver);
        bool Update(int id, Driver driver);
        bool Delete(int dni);
        Driver? GetByDni(int dni);
    }
}