using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRichiestaController : ControllerBase
    {
        private readonly ICommandHandler<UpDateStatoRichiestaCommand> _addhandler;

        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult>
            _sintesiRichiesteQuery;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> addhandler, IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteQuery)
        {
            _addhandler = addhandler;
            _sintesiRichiesteQuery = sintesiRichiesteQuery;
        }

        [HttpPost("AggiornaStato")]
        public async Task<IActionResult> AggiornaStato([FromBody]UpDateStatoRichiestaCommand richiesta)
        {
            var codiceSede = Request.Headers["codicesede"];
            var headerValues = Request.Headers["IdUtente"];
            var idOperatore = headerValues.FirstOrDefault();

            var command = new UpDateStatoRichiestaCommand()
            {
                IdOperatore = idOperatore,
                IdRichiesta = richiesta.IdRichiesta,
                Note = richiesta.Note ?? "",
                Stato = richiesta.Stato,
                CodiceSede = codiceSede
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

        [HttpGet("GetRichiesta")]
        public async Task<IActionResult> GetRichiesta(string idRichiesta)
        {
            var sintesiQuery = new SintesiRichiesteAssistenzaQuery();
            try
            {
                var listaSintesi = _sintesiRichiesteQuery.Handle(sintesiQuery).SintesiRichiesta;
                return Ok(listaSintesi.LastOrDefault(x => x.Codice == idRichiesta));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
