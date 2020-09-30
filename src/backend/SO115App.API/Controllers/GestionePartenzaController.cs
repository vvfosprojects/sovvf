﻿using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaPartenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;

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

        public GestionePartenzaController(
            ICommandHandler<AggiornaStatoMezzoCommand> Addhandler, 
            ICommandHandler<AnnullaPartenzaCommand> AnnullaPartenzahandler,
            ICommandHandler<ModificaPartenzaCommand> ModificaPartenzahandler)
        {
            _addhandler = Addhandler;
            _annullaPartenzahandler = AnnullaPartenzahandler;
            _modificaPartenzahandler = ModificaPartenzahandler;
        }

        [HttpPost("AggiornaPartenza")]
        public async Task<IActionResult> AggiornaPartenza([FromBody] AggiornaStatoMezzoCommand intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["CodiceSede"];
            string idUtente = headerValues.FirstOrDefault();

            var command = new AggiornaStatoMezzoCommand()
            {
                //IdRichiesta = intervento.IdRichiesta,
                IdUtente = idUtente,
                Chiamata = intervento.Chiamata,
                IdMezzo = intervento.IdMezzo,
                StatoMezzo = intervento.StatoMezzo,
                CodiceSede = codiceSede,
                CodRichiesta = intervento.CodRichiesta,
                DataOraAggiornamento = intervento.DataOraAggiornamento.ToLocalTime()
            };

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
                CodSede = Request.Headers["CodiceSede"],
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
    }
}
