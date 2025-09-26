using System.Collections.Generic;
using System.Linq;
using Compugamer.Data.Models;

namespace Compugamer.Services
{
    public class BusService : IBusService
    {
        private readonly List<Bus> buses = new();

        public IEnumerable<Bus> GetAll() => buses;

        public Bus? GetById(int id) => buses.FirstOrDefault(b => b.Id == id);

        public Bus Add(Bus bus)
        {
            bus.Id = buses.Count > 0 ? buses.Max(b => b.Id) + 1 : 1;
            buses.Add(bus);
            return bus;
        }

        public bool Update(int id, Bus updatedBus)
        {
            var bus = buses.FirstOrDefault(b => b.Id == id);
            if (bus == null) return false;
            bus.Plate = updatedBus.Plate;
          
            return true;
        }

        public bool Delete(int id)
        {
            var bus = buses.FirstOrDefault(b => b.Id == id);
            if (bus == null) return false;
            buses.Remove(bus);
            return true;
        }
    }
}
