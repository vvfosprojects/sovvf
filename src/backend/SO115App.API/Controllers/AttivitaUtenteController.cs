using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.MessaInLavorazione;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AttivitaUtenteController : ControllerBase
    {
        private readonly ICommandHandler<MessaInLavorazioneCommand> _addhandler;

        public AttivitaUtenteController(ICommandHandler<MessaInLavorazioneCommand> Addhandler)
        {
            _addhandler = Addhandler;
        }

        [HttpPost("AddInLavorazione")]
        public async Task<IActionResult> AddInLavorazione(string idRichiesta)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            var command = new MessaInLavorazioneCommand()
            {
                IdRichiesta = idRichiesta
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
        public async Task<IActionResult> DeleteInLavorazione(string idRichiesta)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            //var command = new DeleteInLavorazioneCommand()
            //{
            //    DeleteInLavorazione = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("AddPresaInCarico")]
        public async Task<IActionResult> AddPresaInCarico(string idRichiesta)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            //var command = new AddPresaInCaricoCommand()
            //{
            //    AddPresaInCarico = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("DeletePresaInCarico")]
        public async Task<IActionResult> DeletePresaInCarico(string idRichiesta)
        {
            var headerValues = Request.Headers["IdUtente"];
            string IdUtente = headerValues.FirstOrDefault();

            //var command = new DeletePresaInCaricoCommand()
            //{
            //    DeletePresaInCarico = azione
            //};

            try
            {
                //this._Addhandler.Handle(command);
                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
