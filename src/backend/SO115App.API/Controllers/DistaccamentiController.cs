using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DistaccamentiController : ControllerBase
    {
        private readonly IQueryHandler<GetSediQuery, GetSediResult> _handler;

        public DistaccamentiController(IQueryHandler<GetSediQuery, GetSediResult> handler)
        {
            _handler = handler;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAll()
        {
            var query = new GetSediQuery()
            {
                CodiciSede = Request.Headers["CodiceSede"].ToArray(),
                IdUtente = Request.Headers["IdUtente"]
            };

            try
            {
                var result = _handler.Handle(query);

                return Ok(result.DataArray);
            }
            catch (Exception e)
            {
                var ex = e.GetBaseException();

                return BadRequest(ex.Message + ex.StackTrace);
            }
        }
    }
}
