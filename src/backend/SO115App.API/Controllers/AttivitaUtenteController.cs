using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.MessaInLavorazione;
using DomainModel.CQRS.Commands.PresaInCarico;
using DomainModel.CQRS.Commands.RimozioneInLavorazione;
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;

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
        public async Task<IActionResult> AddInLavorazione([FromBody]Intervento intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new MessaInLavorazioneCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento
            };

            try
            {
                this._addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("DeleteInLavorazione")]
        public async Task<IActionResult> DeleteInLavorazione([FromBody]Intervento intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new RimozioneInLavorazioneCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento
            };

            try
            {
                this._deleteInLavorazionehandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("AddPresaInCarico")]
        public async Task<IActionResult> AddPresaInCarico([FromBody]Intervento intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new PresaInCaricoCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento
            };

            try
            {
                this._presaInCaricohandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("DeletePresaInCarico")]
        public async Task<IActionResult> DeletePresaInCarico([FromBody]Intervento intervento)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new RimozionePresaInCaricoCommand()
            {
                IdRichiesta = intervento.Id,
                IdUtente = IdUtente,
                Chiamata = intervento
            };

            try
            {
                this._rimozionePresaInCaricohandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
