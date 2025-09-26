using Compugamer.Data.Models;
using Compugamer.Services;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace Compugamer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class StudentController : ControllerBase
    {
        private static List<Student> students = new List<Student>();
        private readonly ILogger<StudentController> _logger;
        private readonly IStudentService _studentService;

        public StudentController(ILogger<StudentController> logger, IStudentService studentService)
        {
            _logger = logger;
            _studentService = studentService;
        }

        // List all students
        [HttpGet]
        public ActionResult<IEnumerable<Student>> GetAll()
        {
            return Ok(students);
        }

        // Add a new student
        [HttpPost]
        public ActionResult<Student> Add(Student student)
        {
            student.Id = students.Count > 0 ? students.Max(s => s.Id) + 1 : 1;
            students.Add(student);
            return CreatedAtAction(nameof(GetById), new { id = student.Id }, student);
        }

        // Get student by id    
        [HttpGet("{id}")]
        public ActionResult<Student> GetById(int id)
        {
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound();
            return Ok(student);
        }

        // Edit student
        [HttpPut("{id}")]
        public ActionResult Edit(int id, Student updatedStudent)
        {
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound();

            student.Name = updatedStudent.Name;
            student.Age = updatedStudent.Age;
            return NoContent();
        }

        // Delete student
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            var student = students.FirstOrDefault(s => s.Id == id);
            if (student == null)
                return NotFound();

            students.Remove(student);
            return NoContent();
        }
    }
}
