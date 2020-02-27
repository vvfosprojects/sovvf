using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.MessaInLavorazione;
using DomainModel.CQRS.Commands.PresaInCarico;
using DomainModel.CQRS.Commands.RimozioneInLavorazione;
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Utility;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttivitaUtenteController : ControllerBase
    {
        private readonly ICommandHandler<MessaInLavorazioneCommand> _addhandler;
        private readonly ICommandHandler<RimozioneInLavorazioneCommand> _deleteInLavorazionehandler;
        private readonly ICommandHandler<PresaInCaricoCommand> _presaInCaricohandler;
        private readonly ICommandHandler<RimozionePresaInCaricoCommand> _rimozionePresaInCaricohandler;

        public AttivitaUtenteController(
            ICommandHandler<MessaInLavorazioneCommand> Addhandler,
            ICommandHandler<RimozioneInLavorazioneCommand> DeleteInLavorazionehandler,
            ICommandHandler<PresaInCaricoCommand> PresaInCaricohandler,
            ICommandHandler<RimozionePresaInCaricoCommand> RimozionePresaInCaricohandler)
        {
            _addhandler = Addhandler;
            _deleteInLavorazionehandler = DeleteInLavorazionehandler;
            _presaInCaricohandler = PresaInCaricohandler;
            _rimozionePresaInCaricohandler = RimozionePresaInCaricohandler;
        }

        [HttpPost("AddInLavorazione")]
        public async Task<IActionResult> AddInLavorazione([FromBody]SintesiRichiesta intervento)
        {
            var IdUtente = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["codicesede"];

            var command = new MessaInLavorazioneCommand()
            {
                IdRichiesta = intervento.Codice,
                IdUtente = IdUtente,
                Chiamata = intervento,
                CodSede = codiceSede
            };

            try
            {
                this._addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpPost("DeleteInLavorazione")]
        public async Task<IActionResult> DeleteInLavorazione([FromBody]SintesiRichiesta intervento)
        {
            var IdUtente = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["codicesede"];

            var command = new RimozioneInLavorazioneCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento,
                CodSede = codiceSede
            };

            try
            {
                this._deleteInLavorazionehandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpPost("AddPresaInCarico")]
        public async Task<IActionResult> AddPresaInCarico([FromBody]SintesiRichiesta intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["codicesede"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new PresaInCaricoCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento,
                CodSede = codiceSede
            };

            try
            {
                this._presaInCaricohandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpPost("DeletePresaInCarico")]
        public async Task<IActionResult> DeletePresaInCarico([FromBody]SintesiRichiesta intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            var codiceSede = Request.Headers["codicesede"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new RimozionePresaInCaricoCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento,
                CodSede = codiceSede
            };

            try
            {
                this._rimozionePresaInCaricohandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }
    }
}
