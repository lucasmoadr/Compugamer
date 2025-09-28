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
            return Ok(_studentService.GetAll());
        }

        // Add a new student
        [HttpPost]
        public ActionResult<Student> Add(Student student)
        {
            // Verifica que el Dni no exista
            var existing = _studentService.GetByDni(student.Dni);
            if (existing != null)
                return Conflict("El Dni ya existe.");

            var created = _studentService.Add(student);
            return CreatedAtAction(nameof(GetByDni), new { dni = created.Id }, created);

        }

        // Get student by Dni    
        [HttpGet("{dni}")]
        public ActionResult<Driver> GetByDni(int dni)
        {
            var driver = _studentService.GetByDni(dni);
            if (driver == null)
                return NotFound();
            return Ok(driver);
        }

        // Edit student
        [HttpPut("{dni}")]
        public ActionResult Edit(int dni, Student updatedStudent)
        {
            if (!_studentService.Update(dni, updatedStudent))
                return NotFound();
            return NoContent();
        }

        // Delete student
        [HttpDelete("{dni}")]
        public ActionResult Delete(int dni)
        {
            _studentService.Delete(dni);
            return NoContent();
        }
    }
}
