using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Filtri;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.ChiamateInSospeso;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.DettaglioRichiesta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneFile.RiepilogoInterventi;
using System;
using System.IO;
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
        private readonly IQueryHandler<ChiamateInSospesoQuery, ChiamateInSospesoResult> _chiamateInSospesoQuery;

        public GestioneFileController(IQueryHandler<RiepilogoInterventiPathQuery, RiepilogoInterventiPathResult> riepilogoInterventiQuery,
            IQueryHandler<DettaglioRichiestaPathQuery, DettaglioRichiestaPathResult> dettaglioRichiestaQuery,
            IQueryHandler<ChiamateInSospesoQuery, ChiamateInSospesoResult> chiamateInSospesoQuery)
        {
            _dettaglioRichiestaQuery = dettaglioRichiestaQuery;
            _riepilogoInterventiQuery = riepilogoInterventiQuery;
            _chiamateInSospesoQuery = chiamateInSospesoQuery;
        }

        [HttpGet]
        public async Task<IActionResult> DettaglioRichiesta(string codice)
        {
            try
            {
                var query = new DettaglioRichiestaPathQuery()
                {
                    CodiceRichiesta = codice,

                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                var result = _dettaglioRichiestaQuery.Handle(query);

                return File(result.Data, "application/pdf");
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
        public async Task<IActionResult> RiepilogoInterventi([FromBody] FiltriRiepilogoInterventi filtri)
        {
            try
            {
                var query = new RiepilogoInterventiPathQuery()
                {
                    Filtri = filtri,

                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                var result = _riepilogoInterventiQuery.Handle(query);

                return File(result.Data, "application/pdf");
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

        [HttpGet]
        public async Task<IActionResult> ChiamateInSospeso()
        {
            try
            {
                var query = new ChiamateInSospesoQuery()
                {
                    IdOperatore = Request.Headers["IdUtente"],
                    IdSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                var result = _chiamateInSospesoQuery.Handle(query);

                return File(result.Data, "application/csv");
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
