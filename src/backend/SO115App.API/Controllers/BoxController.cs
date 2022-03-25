using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.Utility;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BoxController : ControllerBase
    {
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _mezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _personaleHandler;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _richiesteHandler;

        public BoxController(IQueryHandler<BoxMezziQuery, BoxMezziResult> MezziHandler,
                             IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> PersonaleHandler,
                             IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> RichiesteHandler)
        {
            _mezziHandler = MezziHandler;
            _personaleHandler = PersonaleHandler;
            _richiesteHandler = RichiesteHandler;
        }

        /// <summary>
        ///   EndPoint per il caricamento del Box riassuntivo delle Richieste
        /// </summary>
        [HttpGet("GetBoxRichieste")]
        [ProducesResponseType(typeof(BoxRichiesteResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetBoxRichieste()
        {
            var codiceSede = Request.Headers["codicesede"];

            BoxRichiesteQuery query = new BoxRichiesteQuery()
            {
                CodiciSede = new string[1] { codiceSede }
            };

            try
            {
                return Ok(_richiesteHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            };
        }

        /// <summary>
        ///   EndPoint per il caricamento del Box riassuntivo dei Mezzi
        /// </summary>
        [HttpGet("GetBoxMezzi")]
        [ProducesResponseType(typeof(BoxMezziResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetBoxMezzi()
        {
            var codiceSede = Request.Headers["codicesede"];

            BoxMezziQuery query = new BoxMezziQuery()
            {
                CodiciSede = new string[1] { codiceSede }
            };

            try
            {
                return Ok(_mezziHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            };
        }

        /// <summary>
        ///   EndPoint per il caricamento del Box riassuntivo del Personale
        /// </summary>
        [HttpGet("GetBoxPersonale")]
        [ProducesResponseType(typeof(BoxPersonaleResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetBoxPersonale()
        {
            var codiceSede = Request.Headers["codicesede"];

            BoxPersonaleQuery query = new BoxPersonaleQuery()
            {
                CodiciSede = new string[1] { codiceSede }
            };

            try
            {
                return Ok(_personaleHandler.Handle(query));
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            };
        }
    }
}
