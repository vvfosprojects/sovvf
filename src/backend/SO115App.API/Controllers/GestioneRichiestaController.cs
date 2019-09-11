using System;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.FakePersistenceJSon.GestioneIntervento;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneRichiestaController : ControllerBase
    {
        private readonly ICommandHandler<UpDateStatoRichiestaCommand> _addhandler;
        private readonly IGetRichiestaById _getRichiestaById;

        public GestioneRichiestaController(
            ICommandHandler<UpDateStatoRichiestaCommand> Addhandler, IGetRichiestaById getRichiestaById)
        {
            _addhandler = Addhandler;
            _getRichiestaById = getRichiestaById;
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
                Note = richiesta.Note ?? "",
                Stato = richiesta.Stato
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
            try
            {
                return Ok(_getRichiestaById.Get(idRichiesta));
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
