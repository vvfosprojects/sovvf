using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.GestrionePartenza.AggiornaStatoMezzo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
            string IdUtente = headerValues.FirstOrDefault();

            var command = new AggiornaStatoMezzoCommand()
            {
                //IdRichiesta = intervento.IdRichiesta,
                IdUtente = IdUtente,
                Chiamata = intervento.Chiamata,
                IdMezzo = intervento.IdMezzo,
                StatoMezzo = intervento.StatoMezzo
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
    }
}
