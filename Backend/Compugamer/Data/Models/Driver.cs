namespace Compugamer.Data.Models
{
    public class Driver
    {
        public int Id { get; set; }
        public int Dni { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Age { get; set; }
        public int LicenseNumber { get; set; }
        public int? BusId { get; set; } // Micro/bus asignado (puede ser null)

    
    }
}
