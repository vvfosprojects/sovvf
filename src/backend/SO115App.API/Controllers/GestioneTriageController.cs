using System;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneTriage;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneTriageController : ControllerBase
    {
        private readonly ICommandHandler<AddTriageCommand> _addhandler;
        private readonly ICommandHandler<UpDateTriageCommand> _updatehandler;
        private readonly IQueryHandler<GetTriageQuery, GetTriageResult> _getHandler;

        public GestioneTriageController(
            ICommandHandler<AddTriageCommand> Addhandler,
            ICommandHandler<UpDateTriageCommand> Updatehandler,
            IQueryHandler<GetTriageQuery, GetTriageResult> GetHandler)
        {
            _addhandler = Addhandler;
            _updatehandler = Updatehandler;
            _getHandler = GetHandler;
        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody] AddTriageCommand triage)
        {
            var codiceSede = Request.Headers["codicesede"];

            triage.Triage.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];

            triage.Triage.CodDettaglioTipologia = triage.codDettaglioTipologia;
            triage.Triage.CodTipologia = triage.CodTipologia;

            if (triage.ListaTriageData != null)
            {
                foreach (var item in triage.ListaTriageData)
                {
                    item.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];
                    item.CodTipologia = triage.CodTipologia;
                    item.CodDettaglioTipologia = triage.codDettaglioTipologia;
                }
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
        public async Task<IActionResult> Get([FromBody] GetTriageQuery getTriageQuery)
        {
            var codiceSede = Request.Headers["codicesede"];

            getTriageQuery.CodiceSede = codiceSede;

            try
            {
                return Ok(_getHandler.Handle(getTriageQuery));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, new { message = Costanti.UtenteNonAutorizzato });
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("UpDate")]
        public async Task<IActionResult> UpDate([FromBody] UpDateTriageCommand triage)
        {
            var codiceSede = Request.Headers["codicesede"];

            triage.Triage.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];

            triage.Triage.CodDettaglioTipologia = triage.codDettaglioTipologia;
            triage.Triage.CodTipologia = triage.CodTipologia;

            if (triage.ListaTriageData != null)
            {
                foreach (var item in triage.ListaTriageData)
                {
                    item.CodiceSede = codiceSede.ToString().Split(',', StringSplitOptions.RemoveEmptyEntries)[0];
                    item.CodTipologia = triage.CodTipologia;
                    item.CodDettaglioTipologia = triage.codDettaglioTipologia;
                }
            }

            try
            {
                _updatehandler.Handle(triage);
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
