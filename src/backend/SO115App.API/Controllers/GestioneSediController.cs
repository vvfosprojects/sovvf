using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSediController : ControllerBase
    {
        private readonly IQueryHandler<GetSediQuery, GetSediResult> _getSediHandler;

        public GestioneSediController(IQueryHandler<GetSediQuery, GetSediResult> getSediHandler)
        {
            _getSediHandler = getSediHandler;
        }
    
        /// <summary>
        ///   Metodo che restituisce tutte le sedi VVF
        /// </summary>
        [HttpGet("GetAllSedi")]
        [ProducesResponseType(typeof(GetSediResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAllSedi()
        {
            try
            {
                var query = new GetSediQuery
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                    IdUtente = Request.Headers["IdUtente"]
                };

                var result = _getSediHandler.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                Serilog.Log.Error(e.Message);

                e = e.GetBaseException();

                return BadRequest(new { message = e.Message, stackTrace = e.StackTrace });
            }
        }
    }
}
