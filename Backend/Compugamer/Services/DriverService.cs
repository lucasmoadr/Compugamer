using System.Collections.Generic;
using System.Linq;
using Compugamer.Data;
using Compugamer.Data.Models;

namespace Compugamer.Services
{
    public class DriverService : IDriverService
    {
        public IEnumerable<Driver> GetAll() => InMemoryDatabase.Drivers;

        public Driver? GetById(int id) => InMemoryDatabase.Drivers.FirstOrDefault(d => d.Id == id);

        public Driver? GetByDni(int dni) => InMemoryDatabase.Drivers.FirstOrDefault(d => d.Dni == dni);

        public Driver Add(Driver driver)
        {
            // Validar que no exista un chofer con el mismo DNI
            if (InMemoryDatabase.Drivers.Any(d => d.Dni == driver.Dni))
                throw new InvalidOperationException("Ya existe un chofer con ese DNI.");

            // Validar que no exista un estudiante con el mismo DNI
            if (InMemoryDatabase.Students.Any(s => s.Dni == driver.Dni))
                throw new InvalidOperationException("Ya existe un estudiante con ese DNI.");

            driver.Id = InMemoryDatabase.Drivers.Count > 0 ? InMemoryDatabase.Drivers.Max(d => d.Id) + 1 : 1;
            InMemoryDatabase.Drivers.Add(driver);
            return driver;
        }

        public bool Update(int id, Driver updatedDriver)
        {
            var driver = InMemoryDatabase.Drivers.FirstOrDefault(d => d.Id == id);
            if (driver == null) return false;
            driver.Name = updatedDriver.Name;
            driver.LicenseNumber = updatedDriver.LicenseNumber;
            return true;
        }

        public bool Delete(int dni)
        {
            var driver = InMemoryDatabase.Drivers.FirstOrDefault(d => d.Dni == dni);
            if (driver == null) return false;
            InMemoryDatabase.Drivers.Remove(driver);
            return true;
        }
    }
}