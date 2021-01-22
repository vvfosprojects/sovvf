using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetTipologieSoccorsoAereo;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSoccorsoAereoController : ControllerBase
    {
        private readonly IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult> _getCategorieSoccorsoAereo;
        private readonly IQueryHandler<GetTipologieSoccorsoAereoQuery, GetTipologieSoccorsoAereoResult> _getTipologieSoccorsoAereo;
        private readonly IQueryHandler<GetStoricoRichiestaSoccorsoAereoQuery, GetStoricoRichiestaSoccorsoAereoResult> _getStoricoRichiestaSoccorsoAereo;
        private readonly ICommandHandler<InserisciRichiestaSoccorsoAereoCommand> _inserisciRichiestaSoccorsoAereo;
        private readonly ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand> _annullaRichiestaSoccorsoAereo;

        public GestioneSoccorsoAereoController(IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult> getCategorieSoccorsoAereo,
            IQueryHandler<GetTipologieSoccorsoAereoQuery, GetTipologieSoccorsoAereoResult> getTipologieSoccorsoAereo,
            IQueryHandler<GetStoricoRichiestaSoccorsoAereoQuery, GetStoricoRichiestaSoccorsoAereoResult> getStoricoRichiestaSoccorsoAereo,
            ICommandHandler<InserisciRichiestaSoccorsoAereoCommand> inserisciRichiestaSoccorsoAereo,
            ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand> annullaRichiestaSoccorsoAereo)
        {
            _getTipologieSoccorsoAereo = getTipologieSoccorsoAereo;
            _getCategorieSoccorsoAereo = getCategorieSoccorsoAereo;
            _inserisciRichiestaSoccorsoAereo = inserisciRichiestaSoccorsoAereo;
            _annullaRichiestaSoccorsoAereo = annullaRichiestaSoccorsoAereo;
            _getCategorieSoccorsoAereo = getCategorieSoccorsoAereo;
            _getStoricoRichiestaSoccorsoAereo = getStoricoRichiestaSoccorsoAereo;
        }

        [HttpGet("GetCategorieSoccorso")]
        public async Task<IActionResult> GetCategorieSoccorso()
        {
            try
            {
                var query = new GetCategorieSoccorsoAereoQuery() 
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"]
                };

                var result = _getCategorieSoccorsoAereo.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpPost("Inserisci")]
        public async Task<IActionResult> Inserisci([FromBody] NuovaRichiestaSoccorsoAereo richiesta)
        {
            try
            {
                var command = new InserisciRichiestaSoccorsoAereoCommand()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],
                    RichiestaSoccorsoAereo = richiesta
                };

                _inserisciRichiestaSoccorsoAereo.Handle(command);

                if (command.ResponseAFM.IsError())
                {
                    throw new Exception("Inserimento richiesta soccorso aereo fallito");
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpPost("Annulla")]
        public async Task<IActionResult> Annulla([FromBody] AnnullaRichiestaSoccorsoAereoCommand command)
        {
            try
            {
                command.IdOperatore = Request.Headers["IdUtente"];
                command.CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                _annullaRichiestaSoccorsoAereo.Handle(command);

                if (!((AnnullamentoRichiestaSoccorsoAereo)command.Richiesta.Eventi.LastOrDefault()).Note.Contains("Annullamento AFM accettato"))
                {
                    throw new Exception("Annullamento richiesta soccorso aereo fallito");
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpGet("GetTipologieSoccorso")]
        public async Task<IActionResult> GetTipologieSoccorso()
        {
            try
            {
                var query = new GetTipologieSoccorsoAereoQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"]
                };

                var result = _getTipologieSoccorsoAereo.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpGet("GetStoricoRichiestaSoccorso")]
        public async Task<IActionResult> GetStoricoRichiestaSoccorso(string requestKey)
        {
            try
            {
                var query = new GetStoricoRichiestaSoccorsoAereoQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],

                    RequestKey = requestKey
                };

                var result = _getStoricoRichiestaSoccorsoAereo.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }

        [HttpGet("GetInfoRichiestaSoccorso")]
        private async Task<IActionResult> GetInfoRichiestaSoccorso(string requestKey)
        {
            try
            {
                var idUtente = Request.Headers["IdUtente"];
                var codiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                return null;
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    }
}
