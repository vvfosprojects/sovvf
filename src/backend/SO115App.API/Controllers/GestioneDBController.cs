using CQRS.Queries;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneDB;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneDB.BonificaSchedeContatto;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneDB.ResetUtenti;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneExternalLog;
using SO115App.Persistence.MongoDB.GestioneDB;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneDBController : ControllerBase
    {
        private readonly IQueryHandler<ResetDBQuery, ResetDBResult> _resetDBQuery;
        private readonly IQueryHandler<ResetUtentiQuery, ResetUtentiResult> _resetUtentiQuery;
        private readonly IQueryHandler<BonificaSchedeContattoQuery, BonificaSchedeContattoResult> _bonificaSchedeContattoQuery;
        private readonly IQueryHandler<ExternalLogQuery, ExternalLogResult> _externalLogQuery;
        private readonly ISetTipologie _setTipologie;

        public GestioneDBController(IQueryHandler<ResetDBQuery, ResetDBResult> resetDBQuery,
                                    IQueryHandler<ResetUtentiQuery, ResetUtentiResult> resetUtentiQuery,
                                    IQueryHandler<BonificaSchedeContattoQuery, BonificaSchedeContattoResult> bonificaSchedeContattoQuery,
                                    IQueryHandler<ExternalLogQuery, ExternalLogResult> ExternalLogQuery,
                                    ISetTipologie setTipologie)
        {
            _resetDBQuery = resetDBQuery;
            _resetUtentiQuery = resetUtentiQuery;
            _bonificaSchedeContattoQuery = bonificaSchedeContattoQuery;
            _externalLogQuery = ExternalLogQuery;
            _setTipologie = setTipologie;
        }

        [HttpGet("Reset")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> Reset()
        {
            ResetDBQuery query = new ResetDBQuery()
            {
                esegui = true
            };

            try
            {
                return Ok(_resetDBQuery.Handle(query).risultato);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(ex.Message);
            }
        }

        [HttpGet("ResetUtenti")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> ResetUtenti()
        {
            ResetUtentiQuery query = new ResetUtentiQuery()
            {
                esegui = true
            };

            try
            {
                return Ok(_resetUtentiQuery.Handle(query).risultato);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(ex.Message);
            }
        }

        [HttpGet("BonificaSchedeContatto")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> BonificaSchedeContatto()
        {
            BonificaSchedeContattoQuery query = new BonificaSchedeContattoQuery()
            {
                esegui = true
            };

            try
            {
                return Ok(_bonificaSchedeContattoQuery.Handle(query).risultato);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetExternalLog")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> GetExternalLog()
        {
            ExternalLogQuery query = new ExternalLogQuery()
            {
                esegui = true
            };

            try
            {
                return Ok(_externalLogQuery.Handle(query).risultato);
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(ex.Message);
            }
        }

        [HttpGet("managetipologie")]
        [ProducesResponseType(typeof(string), 400)]
        public async Task<IActionResult> managetip()
        {
            try
            {
                _setTipologie.SetUtilitaAFM();

                return Ok();
            }
            catch (Exception ex)
            {
                Serilog.Log.Error(ex.Message);

                return BadRequest(ex.Message);
            }
        }
    }
}
