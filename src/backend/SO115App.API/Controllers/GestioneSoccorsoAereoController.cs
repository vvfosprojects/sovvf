﻿using CQRS.Commands;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetCategorieSoccorsoAereo;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetInfoAFM;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneSoccorsoAereo.GetStoricoAFM;
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

        [HttpGet("GetCategorie")]
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

        [HttpGet("GetTipologie")]
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

        [HttpGet("GetStorico")]
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

        [HttpGet("GetInfo")]
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

        [HttpPost("Inserisci")]
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

        [HttpPost("Annulla")]
        public async Task<IActionResult> AnnullaRichiestaSoccorsoAereo([FromBody] AnnullaRichiestaSoccorsoAereoCommand command)
        {
            try
            {
                command.IdOperatore = Request.Headers["IdUtente"];
                command.CodiciSede = Request.Headers["CodiceSede"].ToString().Split(",", StringSplitOptions.RemoveEmptyEntries);

                _annulla.Handle(command);

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
    }
}
