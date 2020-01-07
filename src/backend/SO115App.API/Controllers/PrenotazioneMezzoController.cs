using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PrenotazioneMezzoController : ControllerBase
    {
        private readonly ICommandHandler<SetMezzoPrenotatoCommand> _mezzoPrenotatoHandler;

        public PrenotazioneMezzoController(ICommandHandler<SetMezzoPrenotatoCommand> mezzoPrenotatoHandler)
        {
            _mezzoPrenotatoHandler = mezzoPrenotatoHandler;
        }

        [HttpPost("PrenotaMezzo")]
        public async Task<IActionResult> PrenotaMezzo([FromBody]StatoOperativoMezzo mezzoPrenotato)
        {
            mezzoPrenotato.CodiceSede = Request.Headers["codicesede"];
            mezzoPrenotato.SbloccaMezzo = false;

            mezzoPrenotato.IstantePrenotazione = DateTime.UtcNow;
            mezzoPrenotato.IstanteScadenzaSelezione = DateTime.UtcNow.AddSeconds(15);

            var command = new SetMezzoPrenotatoCommand()
            {
                MezzoPrenotato = mezzoPrenotato,
            };

            try
            {
                _mezzoPrenotatoHandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }

        [HttpPost("SbloccaMezzo")]
        public async Task<IActionResult> SbloccaMezzo([FromBody] StatoOperativoMezzo mezzoPrenotato)
        {
            mezzoPrenotato.CodiceSede = Request.Headers["codicesede"];
            mezzoPrenotato.SbloccaMezzo = true;

            var command = new SetMezzoPrenotatoCommand()
            {
                MezzoPrenotato = mezzoPrenotato,
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
