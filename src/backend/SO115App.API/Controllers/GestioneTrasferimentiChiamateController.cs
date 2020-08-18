using CQRS.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneTrasferimentiChiamateController : ControllerBase
    {
        private readonly ICommandHandler<AddTrasferimentoCommand> _handler;
        public GestioneTrasferimentiChiamateController(ICommandHandler<AddTrasferimentoCommand> handler)
        {
            _handler = handler;
        }


        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] TrasferimentoChiamata trasferimento)
        {
            var command = new AddTrasferimentoCommand()
            {
                IdOperatore = Request.Headers["IdUtente"],
                CodiceSede = Request.Headers["CodiceSede"],

                TrasferimentoChiamata = trasferimento
            };

            try
            {
                _handler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
