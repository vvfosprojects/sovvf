using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GestioneFileController : ControllerBase
    {
        private readonly IQueryHandler<DettaglioRichiestaQuery, DettaglioRichiestaResult> _dettaglioRichiestaQuery;

        public GestioneFileController(IQueryHandler<DettaglioRichiestaQuery, DettaglioRichiestaResult> dettaglioRichiestaQuery)
        {
            _dettaglioRichiestaQuery = dettaglioRichiestaQuery;
        }  

        [HttpGet("Get")]
        public async Task<IActionResult> DettaglioRichiesta(string codice)
        {
            try
            {
                var query = new DettaglioRichiestaQuery()
                {
                    Codice = codice,

                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)                
                };                

                var result = _dettaglioRichiestaQuery.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(new 
                { 
                    message = e.GetBaseException().Message,
                    stacktrace = e.GetBaseException().StackTrace
                });
            }
        }
    }
}
