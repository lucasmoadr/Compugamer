using Compugamer.Data;
using Compugamer.Data.Models;
using System.Collections.Generic;
using System.Linq;

namespace Compugamer.Services
{
    public class BusService : IBusService
    {
        private readonly    IDriverService _driverService;

        public BusService(IDriverService driverService)
        {
            _driverService = driverService;
        }
        public IEnumerable<Bus> GetAll() => InMemoryDatabase.Buses;

        public Bus? GetById(int id) => InMemoryDatabase.Buses.FirstOrDefault(b => b.Id == id);

        public Bus Add(Bus bus)
        {
            bus.Id = InMemoryDatabase.Buses.Count > 0 ? InMemoryDatabase.Buses.Max(b => b.Id) + 1 : 1;
            InMemoryDatabase.Buses.Add(bus);
            return bus;
        }

        public bool Update(int id, Bus updatedBus)
        {
            var bus = GetById(id);
            if (bus == null) return false;
            bus.Plate = updatedBus.Plate;
            bus.DriverDni = updatedBus.DriverDni;
            bus.StudentDnis = updatedBus.StudentDnis;
            return true;
        }

        public bool Delete(int id)
        {
            var bus = GetById(id);
            if (bus == null) return false;
            InMemoryDatabase.Buses.Remove(bus);
            return true;
        }

        public bool AssignDriverToBus(int busId, int driverDni)
        {
            var bus = GetById(busId);

            var driver = _driverService.GetByDni(driverDni);

            if (bus == null || driver == null)
                return false;

            // Verifica que el chofer no esté asignado a otro bus
            if (InMemoryDatabase.Drivers.Any(d => d.BusId != 0 && d.BusId != null && d.BusId != busId && d.Dni == driverDni))
                return false;

            bus.DriverDni = driverDni;
            driver.BusId = busId;
            return true;
        }
    }
}
