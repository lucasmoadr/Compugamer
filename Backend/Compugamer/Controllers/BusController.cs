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
        private readonly ILogger<BusController> _logger;

        public BusController(IBusService busService, ILogger<BusController> logger)
        {
            _busService = busService;
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
    }
}
