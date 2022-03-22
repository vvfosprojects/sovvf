using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetInfoAFM;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoAFM;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetTipologieSoccorsoAereo;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSoccorsoAereoController : ControllerBase
    {
        private readonly IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult> _getCategorie;
        private readonly IQueryHandler<GetTipologieSoccorsoAereoQuery, GetTipologieSoccorsoAereoResult> _getTipologie;
        private readonly IQueryHandler<GetInfoAFMQuery, GetInfoAFMResult> _getInfo;
        private readonly IQueryHandler<GetStoricoAFMQuery, GetStoricoAFMResult> _getStorico;
        private readonly ICommandHandler<InserisciRichiestaSoccorsoAereoCommand> _inserisci;
        private readonly ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand> _annulla;

        public GestioneSoccorsoAereoController(IQueryHandler<GetCategorieSoccorsoAereoQuery, GetCategorieSoccorsoAereoResult> getCategorie,
            IQueryHandler<GetTipologieSoccorsoAereoQuery, GetTipologieSoccorsoAereoResult> getTipologie,
            IQueryHandler<GetInfoAFMQuery, GetInfoAFMResult> getInfo,
            IQueryHandler<GetStoricoAFMQuery, GetStoricoAFMResult> getStorico,
            ICommandHandler<InserisciRichiestaSoccorsoAereoCommand> inserisci,
            ICommandHandler<AnnullaRichiestaSoccorsoAereoCommand> annulla)
        {
            _getCategorie = getCategorie;
            _getTipologie = getTipologie;
            _getInfo = getInfo;
            _getStorico = getStorico;
            _inserisci = inserisci;
            _annulla = annulla;
        }
    
        /// <summary>
        ///   Metodo che restituisce la lista delle categorie
        /// </summary>
        [HttpGet("GetCategorie")]
        [ProducesResponseType(typeof(GetCategorieSoccorsoAereoResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetCategorieSoccorsoAereo()
        {
            try
            {
                var query = new GetCategorieSoccorsoAereoQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"]
                };

                var result = _getCategorie.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    
        /// <summary>
        ///   Metodo che restituisce la lista delle tipologie
        /// </summary>
        [HttpGet("GetTipologie")]
        [ProducesResponseType(typeof(GetTipologieSoccorsoAereoResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        private async Task<IActionResult> GetTipologieSoccorsoAereo()
        {
            try
            {
                var query = new GetTipologieSoccorsoAereoQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"]
                };

                var result = _getTipologie.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    
        /// <summary>
        ///   Metodo che restituisce lo storico
        /// </summary>
        [HttpGet("GetStorico")]
        [ProducesResponseType(typeof(GetStoricoAFMResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetStoricoRichiestaSoccorsoAereo(string requestKey)
        {
            try
            {
                var query = new GetStoricoAFMQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],

                    RequestKey = requestKey
                };

                var result = _getStorico.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    
        /// <summary>
        ///   Metodo che restituisce le info
        /// </summary>
        [HttpGet("GetInfo")]
        [ProducesResponseType(typeof(GetInfoAFMResult), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetInfoRichiestaSoccorsoAereo(string requestKey)
        {
            try
            {
                var query = new GetInfoAFMQuery()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],

                    RequestKey = requestKey
                };

                var result = _getInfo.Handle(query);

                return Ok(result);
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    
        /// <summary>
        ///   Metodo che permette di inserire una Richiesta di Soccorso Aereo
        /// </summary>
        [HttpPost("Inserisci")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> InserisciRichiestaSoccorsoAereo([FromBody] NuovaRichiestaAFM richiesta)
        {
            try
            {
                var command = new InserisciRichiestaSoccorsoAereoCommand()
                {
                    CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries),
                    IdOperatore = Request.Headers["IdUtente"],
                    RichiestaSoccorsoAereo = richiesta
                };

                _inserisci.Handle(command);

                if (command.ResponseAFM.IsError())
                {
                    throw new Exception("Inserimento richiesta soccorso aereo fallito: ");
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest(e.GetBaseException().Message);
            }
        }
    
        /// <summary>
        ///   Metodo che permette di annullare una specifica Richiesta di Soccorso Aereo
        /// </summary>
        [HttpPost("Annulla")]
        //
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> AnnullaRichiestaSoccorsoAereo([FromBody] AnnullaRichiestaSoccorsoAereoCommand command)
        {
            try
            {
                command.IdOperatore = Request.Headers["IdUtente"];
                command.CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                _annulla.Handle(command);

                if (command.ResponseAFM.IsError())
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
    }
}
