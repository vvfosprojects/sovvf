using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.CodaChiamate;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.CodaChiamate.Dettaglio;
using SO115App.Models.Classi.Utility;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneCodaChiamateController : ControllerBase
    {
        private readonly IQueryHandler<CodaChiamateQuery, CodaChiamateResult> _getCodaChiamate;
        private readonly IQueryHandler<CodaChiamateDettaglioQuery, CodaChiamateDettaglioResult> _getCodaChiamateDettaglio;

        public GestioneCodaChiamateController(
            IQueryHandler<CodaChiamateQuery, CodaChiamateResult> getCodaChiamate,
            IQueryHandler<CodaChiamateDettaglioQuery, CodaChiamateDettaglioResult> getCodaChiamateDettaglio)
        {
            _getCodaChiamate = getCodaChiamate;
            _getCodaChiamateDettaglio = getCodaChiamateDettaglio;
        }

        /// <summary>
        ///   Restituisce le informazioni utili a formare l'istogramma di Coda Chiamate
        /// </summary>
        [HttpGet("GetInfoIstogramma")]
        public async Task<IActionResult> GetInfoIstogramma()
        {
            try
            {
                var query = new CodaChiamateQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)
                };

                return Ok(_getCodaChiamate.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        /// <summary>
        ///   Restituisce il dettaglio delle informazioni di una specifica sede, visualizzate su
        ///   Coda Chiamate
        /// </summary>
        [HttpGet("GetDettaglioSede")]
        public async Task<IActionResult> GetDettaglioSede(string codiceSede)
        {
            try
            {
                var query = new CodaChiamateDettaglioQuery()
                {
                    CodiceSede = codiceSede
                };

                return Ok(_getCodaChiamateDettaglio.Handle(query));
            }
            catch (Exception ex)
            {
                ex = ex.GetBaseException();

                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
