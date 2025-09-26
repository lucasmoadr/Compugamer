using System.Collections.Generic;
using System.Linq;
using Compugamer.Data.Models;

namespace Compugamer.Services
{
    public class DriverService : IDriverService
    {
        private readonly List<Driver> drivers = new();

        public IEnumerable<Driver> GetAll() => drivers;

        public Driver? GetById(int id) => drivers.FirstOrDefault(d => d.Id == id);

        public Driver Add(Driver driver)
        {
            driver.Id = drivers.Count > 0 ? drivers.Max(d => d.Id) + 1 : 1;
            drivers.Add(driver);
            return driver;
        }

        public bool Update(int id, Driver updatedDriver)
        {
            var driver = drivers.FirstOrDefault(d => d.Id == id);
            if (driver == null) return false;
            driver.Name = updatedDriver.Name;
            driver.LicenseNumber = updatedDriver.LicenseNumber;
            return true;
        }

        public bool Delete(int id)
        {
            var driver = drivers.FirstOrDefault(d => d.Id == id);
            if (driver == null) return false;
            drivers.Remove(driver);
            return true;
        }
    }
}