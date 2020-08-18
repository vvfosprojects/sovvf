using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using SO115App.Models.Servizi.CQRS.Queries.GestioneTrasferimentiChiamate;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneTrasferimentiChiamateController : ControllerBase
    {
        private readonly ICommandHandler<AddTrasferimentoCommand> _addCommandHandler;
        private readonly IQueryHandler<TrasferimentiChiamateQuery, TrasferimentiChiamateResult> _queryHandler;
        public GestioneTrasferimentiChiamateController(ICommandHandler<AddTrasferimentoCommand> addCommandHandler,
            IQueryHandler<TrasferimentiChiamateQuery, TrasferimentiChiamateResult> queryHandler)
        {
            _addCommandHandler = addCommandHandler;
            _queryHandler = queryHandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add(TrasferimentoChiamata trasferimento)
        {
            var command = new AddTrasferimentoCommand()
            {
                IdOperatore = Request.Headers["IdUtente"],
                CodiceSede = Request.Headers["CodiceSede"],

                TrasferimentoChiamata = trasferimento
            };

            try
            {
                _addCommandHandler.Handle(command);

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }

        [HttpPost("")]
        public async Task<IActionResult> Get(TrasferimentiChiamateQuery query)
        {
            query.IdOperatore = Request.Headers["IdUtente"];
            query.CodiceSede = Request.Headers["CodiceSede"];

            try
            {
                return Ok(_queryHandler.Handle(query));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                else
                    return BadRequest(ex);
            }
        }
    }
}
