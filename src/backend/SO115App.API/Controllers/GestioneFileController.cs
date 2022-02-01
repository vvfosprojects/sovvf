using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi;
using System;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class GestioneFileController : ControllerBase
    {
        private readonly IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult> _riepilogoInterventiQuery;
        private readonly IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult> _dettaglioRichiestaQuery;

        public GestioneFileController(IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult> riepilogoInterventiQuery,
            IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult> dettaglioRichiestaQuery)
        {
            _dettaglioRichiestaQuery = dettaglioRichiestaQuery;
            _riepilogoInterventiQuery = riepilogoInterventiQuery;
        }

        [HttpGet]
        public async Task<IActionResult> DettaglioRichiesta(string codice, string contentType = "application/pdf")
        {
            try
            {
                var query = new DettaglioRichiestaPathQuery()
                {
                    CodiceRichiesta = codice,
                    ContentType = contentType,
                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries),
                };

                var result = _dettaglioRichiestaQuery.Handle(query);

                return File(result.Data.ToArray(), contentType);
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

        [HttpPost]
        public async Task<IActionResult> RiepilogoInterventi([FromBody] FiltriRiepilogoInterventi filtri, [FromQuery] string contentType = "application/pdf")
        {
            try
            {
                var query = new RiepilogoInterventiPathQuery()
                {
                    Filtri = filtri,
                    ContentType = contentType,
                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                var result = _riepilogoInterventiQuery.Handle(query);

                return File(result.Data?.ToArray(), contentType);
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
