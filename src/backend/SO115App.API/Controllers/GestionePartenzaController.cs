using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.SostituzionePartenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaStatoPartenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestionePartenzaController : ControllerBase
    {
        private readonly ICommandHandler<AggiornaStatoMezzoCommand> _addhandler;
        private readonly ICommandHandler<AnnullaStatoPartenzaCommand> _annullaPartenzahandler;
        private readonly ICommandHandler<ModificaPartenzaCommand> _modificaPartenzahandler;
        private readonly ICommandHandler<SostituzionePartenzaCommand> _sostituzionePartenzahandler;

        public GestionePartenzaController(
            ICommandHandler<AggiornaStatoMezzoCommand> Addhandler,
            ICommandHandler<AnnullaStatoPartenzaCommand> AnnullaPartenzahandler,
            ICommandHandler<ModificaPartenzaCommand> ModificaPartenzahandler,
            ICommandHandler<SostituzionePartenzaCommand> SostituzionePartenzahandler)
        {
            _addhandler = Addhandler;
            _annullaPartenzahandler = AnnullaPartenzahandler;
            _modificaPartenzahandler = ModificaPartenzahandler;
            _sostituzionePartenzahandler = SostituzionePartenzahandler;
        }

        /// <summary>
        ///   Aggiorna lo stato di una partenza
        /// </summary>
        [HttpPost("AggiornaPartenza")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AggiornaPartenza([FromBody] AggiornaStatoMezzoCommand command)
        {
            command.CodiciSede = Request.Headers["CodiceSede"].ToString().Split(',');
            command.IdUtente = Request.Headers["IdUtente"].ToString();

            try
            {
                _addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        /// <summary>
        ///   Annulla uno stato precedentemente inserito, di una specifica partenza
        /// </summary>
        [HttpPost("AnnullaStatoPartenza")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AnnullaStatoPartenza([FromBody] AnnullaStatoPartenzaCommand command)
        {
            command.IdOperatore = Request.Headers["IdUtente"];
            command.CodiciSedi = Request.Headers["CodiceSede"][0].Split(',', StringSplitOptions.RemoveEmptyEntries);

            try
            {
                _annullaPartenzahandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message, stacktrace = ex.StackTrace });
            }
        }

        /// <summary>
        ///   Modifica una partenza
        /// </summary>
        [HttpPost("ModificaPartenza")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> ModificaPartenza([FromBody] ModificaPartenza partenza)
        {
            var command = new ModificaPartenzaCommand()
            {
                CodSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                IdOperatore = Request.Headers["IdUtente"],

                ModificaPartenza = partenza
            };

            try
            {
                _modificaPartenzahandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message.Replace("\r\n", ". ") });
            }
        }

        /// <summary>
        ///   Registra una sostituzione all'interno di una partenza
        /// </summary>
        [HttpPost("SostituzionePartenza")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> SostituzionePartenza([FromBody] SostituzioneDTO partenzeDaSostituire)
        {
            partenzeDaSostituire.idOperatore = Request.Headers["IdUtente"];

            var command = new SostituzionePartenzaCommand()
            {
                sostituzione = partenzeDaSostituire
            };

            try
            {
                _sostituzionePartenzahandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message); if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message.Replace("\r\n", ". ") });
            }
        }
    }
}
