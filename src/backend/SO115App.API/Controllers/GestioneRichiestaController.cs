using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRichiestaController : ControllerBase
    {
        private readonly ICommandHandler<UpDateStatoRichiestaCommand> _addhandler;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> Addhandler)
        {
            _addhandler = Addhandler;
        }

        [HttpPost("AggiornaStato")]
        public async Task<IActionResult> AggiornaStato([FromBody]UpDateStatoRichiestaCommand richiesta)
        {
            var headerValues = Request.Headers["IdUtente"];
            string idOperatore = headerValues.FirstOrDefault();

            var command = new UpDateStatoRichiestaCommand()
            {
                IdOperatore = idOperatore,
                IdRichiesta = richiesta.IdRichiesta,
                Note = richiesta.Note == null ? "" : richiesta.Note,
                StatoRichiesta = richiesta.StatoRichiesta
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
