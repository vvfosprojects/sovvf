using CQRS.Queries;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneDB;
using SO115App.Persistence.MongoDB.GestioneDB;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResetDBController : ControllerBase
    {
        private readonly IQueryHandler<ResetDBQuery, ResetDBResult> _resetDBQuery;
        private readonly ISetTipologie _setTipologie;

        public ResetDBController(IQueryHandler<ResetDBQuery, ResetDBResult> resetDBQuery, ISetTipologie setTipologie)
        {
            this._resetDBQuery = resetDBQuery;
            _setTipologie = setTipologie;
        }

        [HttpGet("Reset")]
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
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("managetipologie")]
        public async Task<IActionResult> managetip()
        {

            try
            {
                _setTipologie.SetUtilitaAFM();

                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
