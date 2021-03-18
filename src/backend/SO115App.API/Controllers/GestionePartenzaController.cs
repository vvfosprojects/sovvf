﻿using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.SostituzionePartenza;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestionePartenzaController : ControllerBase
    {
        private readonly ICommandHandler<AggiornaStatoMezzoCommand> _addhandler;
        private readonly ICommandHandler<AnnullaPartenzaCommand> _annullaPartenzahandler;
        private readonly ICommandHandler<ModificaPartenzaCommand> _modificaPartenzahandler;
        private readonly ICommandHandler<SostituzionePartenzaCommand> _sostituzionePartenzahandler;

        public GestionePartenzaController(
            ICommandHandler<AggiornaStatoMezzoCommand> Addhandler,
            ICommandHandler<AnnullaPartenzaCommand> AnnullaPartenzahandler,
            ICommandHandler<ModificaPartenzaCommand> ModificaPartenzahandler,
            ICommandHandler<SostituzionePartenzaCommand> SostituzionePartenzahandler)
        {
            _addhandler = Addhandler;
            _annullaPartenzahandler = AnnullaPartenzahandler;
            _modificaPartenzahandler = ModificaPartenzahandler;
            _sostituzionePartenzahandler = SostituzionePartenzahandler;
        }

        [HttpPost("AggiornaPartenza")]
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("AnnullaPartenza")]
        public async Task<IActionResult> AnnullaPartenzaCommand([FromBody] AnnullaPartenzaCommand partenza)
        {
            var command = new AnnullaPartenzaCommand()
            {
                IdRichiesta = partenza.IdRichiesta,
                TargaMezzo = partenza.TargaMezzo,
                IdOperatore = Request.Headers["IdUtente"],
                CodMotivazione = partenza.CodMotivazione,
                TestoMotivazione = partenza.TestoMotivazione,
                CodRichiestaSubentrata = partenza.CodRichiestaSubentrata
            };

            try
            {
                _annullaPartenzahandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("ModificaPartenza")]
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message.Replace("\r\n", ". ") });
            }
        }

        [HttpPost("SostituzionePartenza")]
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
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else if (ex.Message.Contains(Costanti.MezzoErroreCambioStatoRichiestaChiusa))
                    return StatusCode(403, new { message = Costanti.MezzoErroreCambioStatoRichiestaChiusa });
                else
                    return BadRequest(new { message = ex.Message.Replace("\r\n", ". ") });
            }
        }
    }
}
