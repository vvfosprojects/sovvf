using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneTriageController : ControllerBase
    {
        private readonly ICommandHandler<AddTriageCommand> _addhandler;
        private readonly IQueryHandler<GetTriageQuery, GetTriageResult> _getHandler;

        public GestioneTriageController(
            ICommandHandler<AddTriageCommand> Addhandler,
            IQueryHandler<GetTriageQuery, GetTriageResult> GetHandler)
        {
            _addhandler = Addhandler;
            _getHandler = GetHandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] AddTriageCommand triage)
        {
            var codiceSede = Request.Headers["codicesede"];

            triage.Triage.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];

            triage.Triage.CodDettaglioTipologia = triage.codDettaglioTipologia;
            triage.Triage.CodTipologia = triage.CodTipologia;

            foreach (var item in triage.ListaTriageData)
            {
                item.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];
                item.CodTipologia = triage.CodTipologia;
                item.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];
            }

            try
            {
                _addhandler.Handle(triage);
                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("Get")]
        public async Task<IActionResult> Get([FromBody] int codTipologia, int codDettaglioTipologia)
        {
            var codiceSede = Request.Headers["codicesede"];

            var query = new GetTriageQuery()
            {
                CodDettaglioTipologia = codDettaglioTipologia,
                CodTipologia = codTipologia,
                CodiceSede = codiceSede
            };

            try
            {
                return Ok(_getHandler.Handle(query));
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
