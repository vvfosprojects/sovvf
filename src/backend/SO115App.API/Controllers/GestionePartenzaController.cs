using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.GestrionePartenza.AggiornaStatoMezzo;
using DomainModel.CQRS.Commands.MessaInLavorazione;
using DomainModel.CQRS.Commands.PresaInCarico;
using DomainModel.CQRS.Commands.RimozioneInLavorazione;
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

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
                IdRichiesta = intervento.IdRichiesta,
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
