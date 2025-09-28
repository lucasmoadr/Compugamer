using System.Collections.Generic;
using System.Linq;
using Compugamer.Data.Models;
using Compugamer.Data;

namespace Compugamer.Services
{
    public class StudentService : IStudentService
    {
        public IEnumerable<Student> GetAll() => InMemoryDatabase.Students;

        public Student? GetById(int id) => InMemoryDatabase.Students.FirstOrDefault(s => s.Id == id);

        public Student Add(Student student)
        {
            // Validar que no exista un estudiante con el mismo DNI
            if (InMemoryDatabase.Students.Any(s => s.Dni == student.Dni))
                throw new InvalidOperationException("Ya existe un estudiante con ese DNI.");

            // Validar que no exista un chofer con el mismo DNI
            if (InMemoryDatabase.Drivers.Any(d => d.Dni == student.Dni))
                throw new InvalidOperationException("Ya existe un chofer con ese DNI.");

            student.Id = InMemoryDatabase.Students.Count > 0 ? InMemoryDatabase.Students.Max(s => s.Id) + 1 : 1;
            InMemoryDatabase.Students.Add(student);
            return student;
        }

        public bool Update(int id, Student updatedStudent)
        {
            var student = InMemoryDatabase.Students.FirstOrDefault(s => s.Id == id);
            if (student == null) return false;
            student.Name = updatedStudent.Name;
            student.Age = updatedStudent.Age;
            return true;
        }

        public bool Delete(int dni)
        {
            var student = InMemoryDatabase.Students.FirstOrDefault(s => s.Dni == dni);
            if (student == null) return false;
            InMemoryDatabase.Students.Remove(student);
            return true;
        }

        public Student? GetByDni(int dni) => InMemoryDatabase.Students.FirstOrDefault(s => s.Dni == dni);

        public bool AssignStudentToBus(int busId, int studentDni)
        {
            var bus = InMemoryDatabase.Buses.FirstOrDefault(b => b.Id == busId);
            var student = InMemoryDatabase.Students.FirstOrDefault(s => s.Dni == studentDni);

            if (bus == null || student == null)
                return false;

            if (!bus.StudentDnis.Contains(studentDni))
                bus.StudentDnis.Add(studentDni);

            student.BusId = busId;
            return true;
        }
    }
}