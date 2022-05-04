﻿using CQRS.Queries;
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

        /// <summary>
        ///   Restituisce il PDF del dettaglio di uno specifico intervento
        /// </summary>
        [HttpGet("DettaglioRichiesta")]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
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
                Serilog.Log.Error(e.Message);

                return BadRequest(new
                {
                    message = e.GetBaseException().Message,
                    stacktrace = e.GetBaseException().StackTrace
                });
            }
        }

        /// <summary>
        ///   Restituisce l'elenco di tutti gli interventi che rispondono ai filtri impostati
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(FileContentResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
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
                Serilog.Log.Error(e.Message);

                return BadRequest(new
                {
                    message = e.GetBaseException().Message,
                    stacktrace = e.GetBaseException().StackTrace
                });
            }
        }
    }
}
