using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubricaPersonale;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRubricaPersonaleController : ControllerBase
    {
        IQueryHandler<RubricaPersonaleQuery, RubricaPersonaleResult> _queryHandler;

        public GestioneRubricaPersonaleController(IQueryHandler<RubricaPersonaleQuery, RubricaPersonaleResult> queryHandler)
        {
            _queryHandler = queryHandler;
        }
    
        /// <summary>
        ///   Metodo che restituisce la rubrica del Personale VVF
        /// </summary>
        [HttpPost("")]
        [ProducesResponseType(typeof(RubricaPersonaleResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetAll(RubricaPersonaleQuery query)
        {
            try
            {
                query.IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries);
                query.IdOperatore = Request.Headers["IdUtente"];
                
                var result = _queryHandler.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                Serilog.Log.Error(e.Message);

                e = e.GetBaseException();

                return BadRequest($"{e.Message}: {e.StackTrace}");
            }
        }
    }
}
