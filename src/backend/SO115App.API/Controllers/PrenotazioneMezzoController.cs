using CQRS.Commands;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Classi.Composizione;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrenotazioneMezzoController : ControllerBase
    {
        private readonly ICommandHandler<MezzoPrenotatoCommand> _mezzoPrenotatoHandler;

        public PrenotazioneMezzoController(ICommandHandler<MezzoPrenotatoCommand> mezzoPrenotatoHandler)
        {
            _mezzoPrenotatoHandler = mezzoPrenotatoHandler;
        }

        [HttpPost("PrenotaMezzo")]
        public async Task<IActionResult> PrenotaMezzo([FromBody]MezzoPrenotato mezzoPrenotato)
        {
            var codiceSede = Request.Headers["codicesede"];
            mezzoPrenotato.SbloccaMezzo = false;
            mezzoPrenotato.CodiceSede = codiceSede;

            var command = new MezzoPrenotatoCommand()
            {
                MezzoPrenotato = mezzoPrenotato,
                CodiceSede = codiceSede
            };

            try
            {
                _mezzoPrenotatoHandler.Handle(command);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }

        [HttpPost("SbloccaMezzo")]
        public async Task<IActionResult> SbloccaMezzo([FromBody] MezzoPrenotato mezzoPrenotato)
        {
            var codiceSede = Request.Headers["codicesede"];
            mezzoPrenotato.SbloccaMezzo = true;

            var command = new MezzoPrenotatoCommand()
            {
                MezzoPrenotato = mezzoPrenotato,
                CodiceSede = codiceSede
            };

            try
            {
                _mezzoPrenotatoHandler.Handle(command);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
