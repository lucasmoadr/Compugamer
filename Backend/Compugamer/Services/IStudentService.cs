using System.Collections.Generic;
using Compugamer.Data.Models;
namespace Compugamer.Services
{
    public interface IStudentService
    {
        IEnumerable<Student> GetAll();
        Student? GetById(int id);
        Student Add(Student student);
        bool Update(int id, Student student);
        bool Delete(int id);
    }
}