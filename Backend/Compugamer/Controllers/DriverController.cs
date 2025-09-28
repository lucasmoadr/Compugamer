using Microsoft.AspNetCore.Mvc;
using Compugamer.Services;
using Compugamer.Data.Models;
using System.Collections.Generic;

namespace Compugamer.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverService _driverService;
        private readonly ILogger<DriverController> _logger;

        public DriverController(IDriverService driverService, ILogger<DriverController> logger)
        {
            _driverService = driverService;
            _logger = logger;
        }

        // List all drivers
        [HttpGet]
        public ActionResult<IEnumerable<Driver>> GetAll()
        {
            return Ok(_driverService.GetAll());
        }

        // Add a new driver
        [HttpPost]
        public ActionResult<Driver> Add(Driver driver)
        {
            // Verifica que el Dni no exista
            var existing = _driverService.GetByDni(driver.Dni);
            if (existing != null)
                return Conflict("El Dni ya existe.");

            var created = _driverService.Add(driver);
            return CreatedAtAction(nameof(GetByDni), new { dni = created.Id }, created);
        }

        // Get driver by Dni
        [HttpGet("{dni}")]
        public ActionResult<Driver> GetByDni(int dni)
        {
            var driver = _driverService.GetByDni(dni);
            if (driver == null)
                return NotFound();
            return Ok(driver);
        }

        // Edit driver
        [HttpPut("{dni}")]
        public ActionResult Edit(int dni, Driver updatedDriver)
        {
            if (!_driverService.Update(dni, updatedDriver))
                return NotFound();
            return NoContent();
        }

        // Delete driver
        [HttpDelete("{dni}")]
        public ActionResult Delete(int dni)
        {
            if (!_driverService.Delete(dni))
                return NotFound();
            return NoContent();
        }
    }
}
