namespace Compugamer.Data.Models
{
    public class Bus
    {
        public int Id { get; set; }
        public string Plate { get; set; } = string.Empty;
        public int? DriverDni { get; set; } // Dni del chofer asignado (puede ser null)
        public List<int> StudentDnis { get; set; } = new(); // Dnis de estudiantes asignados


    }
}
