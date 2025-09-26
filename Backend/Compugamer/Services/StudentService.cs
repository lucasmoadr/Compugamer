using System.Collections.Generic;
using System.Linq;
using Compugamer.Controllers;
using Compugamer.Data.Models;
namespace Compugamer.Services
{
    public class StudentService : IStudentService
    {
        private readonly List<Student> students = new();

        public IEnumerable<Student> GetAll() => students;

        public Student? GetById(int id) => students.FirstOrDefault(s => s.Id == id);

        public Student Add(Student student)
        {
            student.Id = students.Count > 0 ? students.Max(s => s.Id) + 1 : 1;
            students.Add(student);
            return student;
        }

        public bool Update(int id, Student updatedStudent)
        {
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null) return false;
            student.Name = updatedStudent.Name;
            student.Age = updatedStudent.Age;
            return true;
        }

        public bool Delete(int id)
        {
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null) return false;
            students.Remove(student);
            return true;
        }
    }
}