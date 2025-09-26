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
            var created = _driverService.Add(driver);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }

        // Get driver by id
        [HttpGet("{id}")]
        public ActionResult<Driver> GetById(int id)
        {
            var driver = _driverService.GetById(id);
            if (driver == null)
                return NotFound();
            return Ok(driver);
        }

        // Edit driver
        [HttpPut("{id}")]
        public ActionResult Edit(int id, Driver updatedDriver)
        {
            if (!_driverService.Update(id, updatedDriver))
                return NotFound();
            return NoContent();
        }

        // Delete driver
        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            if (!_driverService.Delete(id))
                return NotFound();
            return NoContent();
        }
    }
}
