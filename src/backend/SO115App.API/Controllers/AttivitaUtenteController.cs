using CQRS.Commands;
using DomainModel.CQRS.Commands.PresaInCarico;
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Utility;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttivitaUtenteController : ControllerBase
    {
        private readonly ICommandHandler<PresaInCaricoCommand> _presaInCaricohandler;
        private readonly ICommandHandler<RimozionePresaInCaricoCommand> _rimozionePresaInCaricohandler;

        public AttivitaUtenteController(
            ICommandHandler<PresaInCaricoCommand> PresaInCaricohandler,
            ICommandHandler<RimozionePresaInCaricoCommand> RimozionePresaInCaricohandler)
        {
            _presaInCaricohandler = PresaInCaricohandler;
            _rimozionePresaInCaricohandler = RimozionePresaInCaricohandler;
        }

        [HttpPost("AddPresaInCarico")]
        public async Task<IActionResult> AddPresaInCarico([FromBody] SintesiRichiesta intervento)
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
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("DeletePresaInCarico")]
        public async Task<IActionResult> DeletePresaInCarico([FromBody] SintesiRichiesta intervento)
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
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
