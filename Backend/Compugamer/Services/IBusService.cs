using System.Collections.Generic;
using Compugamer.Data.Models;

namespace Compugamer.Services
{
    public interface IBusService
    {
        IEnumerable<Bus> GetAll();
        Bus? GetById(int id);
        Bus Add(Bus bus);
        bool Update(int id, Bus bus);
        bool Delete(int id);
    }
}