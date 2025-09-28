using Microsoft.AspNetCore.Mvc;
using Compugamer.Services;
using Compugamer.Data.Models;
using System.Collections.Generic;

namespace Compugamer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BusController : ControllerBase
    {
        private readonly IBusService _busService;
        private readonly IDriverService _driverService;
        private readonly IStudentService _studentService;
        private readonly ILogger<BusController> _logger;

        public BusController(
            IBusService busService,
            IDriverService driverService,
            IStudentService studentService,
            ILogger<BusController> logger)
        {
            _busService = busService;
            _driverService = driverService;
            _studentService = studentService;
            _logger = logger;
        }

        // List all buses
        [HttpGet]
        public ActionResult<IEnumerable<Bus>> GetAll()
        {
            return Ok(_busService.GetAll());
        }

        // Add a new bus
        [HttpPost]
        public ActionResult<Bus> Add(Bus bus)
        {
            var created = _busService.Add(bus);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Get bus by id
        [HttpGet("{id}")]
        public ActionResult<Bus> GetById(int id)
        {
            var bus = _busService.GetById(id);
            if (bus == null)
                return NotFound();
            return Ok(bus);
        }

        // Edit bus
        [HttpPut("{id}")]
        public ActionResult Edit(int id, Bus updatedBus)
        {
            if (!_busService.Update(id, updatedBus))
                return NotFound();
            return NoContent();
        }

        // Delete bus
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (!_busService.Delete(id))
                return NotFound();
            return NoContent();
        }

        // Assign driver to bus
        [HttpPost("{busId}/assign-driver/{driverDni}")]
        public ActionResult AssignDriver(int busId, int driverDni)
        {
            var driver = _driverService.GetByDni(driverDni);
            if (driver == null)
                return NotFound("Chofer no encontrado.");

            if (driver.BusId != 0 && driver.BusId != null && driver.BusId != busId)
                return Conflict("El chofer ya está asignado a otro bus.");

            var success = _busService.AssignDriverToBus(busId, driverDni);
            if (!success)
                return BadRequest("No se pudo asignar el chofer al bus.");
            return Ok(new { mensaje = "Chofer asignado correctamente." });
            
        }

        // Assign student to bus
        [HttpPost("{busId}/assign-student/{studentDni}")]
        public ActionResult AssignStudent(int busId, int studentDni)
        {
            var student = _studentService.GetByDni(studentDni);
            if (student == null)
                return NotFound("Estudiante no encontrado.");

            var success = _studentService.AssignStudentToBus(busId, studentDni);
            if (!success)
                return BadRequest("No se pudo asignar el estudiante al bus.");

            return Ok(new { mensaje = "Estudiante asignado correctamente." });
        }
    }
}
