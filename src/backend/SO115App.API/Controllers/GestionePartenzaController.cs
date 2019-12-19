using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestionePartenzaController : ControllerBase
    {
        private readonly ICommandHandler<AggiornaStatoMezzoCommand> _addhandler;

        public GestionePartenzaController(
            ICommandHandler<AggiornaStatoMezzoCommand> Addhandler)
        {
            _addhandler = Addhandler;
        }

        [HttpPost("AggiornaPartenza")]
        public async Task<IActionResult> AggiornaPartenza([FromBody]AggiornaStatoMezzoCommand intervento)
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
            };

            try
            {
                _addhandler.Handle(command);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest();
            }
        }
    }
}
