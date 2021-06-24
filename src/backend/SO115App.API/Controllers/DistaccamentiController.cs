using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetDistaccamentiByCodSede;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSedi;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediAllerta;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSedi.GetSediTrasferimenti;
using System;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DistaccamentiController : ControllerBase
    {
        private readonly IQueryHandler<GetSediQuery, GetSediResult> _handler;
        private readonly IQueryHandler<GetSediAllertaQuery, GetSediAllertaResult> _handlerAllerta;
        private readonly IQueryHandler<GetSediTrasferimentiQuery, GetSediTrasferimentiResult> _handlerTrasferimenti;
        private readonly IQueryHandler<GetDistaccamentiByCodSedeQuery, GetDistaccamentiByCodSedeResult> _handlerGetDistaccamentiBycodSede;

        public DistaccamentiController(IQueryHandler<GetSediQuery, GetSediResult> handler,
            IQueryHandler<GetSediAllertaQuery, GetSediAllertaResult> handlerAllerta,
            IQueryHandler<GetSediTrasferimentiQuery, GetSediTrasferimentiResult> handlerTrasferimenti,
            IQueryHandler<GetDistaccamentiByCodSedeQuery, GetDistaccamentiByCodSedeResult> handlerGetDistaccamentiBycodSede)
        {
            _handler = handler;
            _handlerAllerta = handlerAllerta;
            _handlerTrasferimenti = handlerTrasferimenti;
            _handlerGetDistaccamentiBycodSede = handlerGetDistaccamentiBycodSede;
        }

        [HttpGet("Get")]
        public async Task<IActionResult> GetAll()
        {
            var query = new GetSediQuery()
            {
                CodiciSede = Request.Headers["CodiceSede"].ToArray(),
                IdUtente = Request.Headers["IdUtente"]
            };

            try
            {
                var result = _handler.Handle(query);

                return Ok(result.DataArray);
            }
            catch (Exception e)
            {
                var ex = e.GetBaseException();

                return BadRequest(ex.Message + ex.StackTrace);
            }
        }

        [HttpGet("GetDistaccamentiByCodSede")]
        public async Task<IActionResult> GetDistaccamentiByCodSede()
        {
            var query = new GetDistaccamentiByCodSedeQuery()
            {
                CodiciSede = Request.Headers["CodiceSede"].ToArray(),
                IdUtente = Request.Headers["IdUtente"]
            };

            try
            {
                var result = _handlerGetDistaccamentiBycodSede.Handle(query);

                return Ok(result.DataArray);
            }
            catch (Exception e)
            {
                var ex = e.GetBaseException();

                return BadRequest(ex.Message + ex.StackTrace);
            }
        }

        [HttpGet("GetSediTrasferimenti")]
        public async Task<IActionResult> GetSediTrasferimenti()
        {
            var query = new GetSediTrasferimentiQuery()
            {
                CodiciSede = Request.Headers["CodiceSede"].ToArray(),
                IdUtente = Request.Headers["IdUtente"]
            };

            try
            {
                var result = _handlerTrasferimenti.Handle(query);

                return Ok(result.DataArray);
            }
            catch (Exception e)
            {
                var ex = e.GetBaseException();

                return BadRequest(ex.Message + ex.StackTrace);
            }
        }

        [HttpGet("GetSediAllerta")]
        public async Task<IActionResult> GetSediAllerta()
        {
            var query = new GetSediAllertaQuery()
            {
                CodiciSede = Request.Headers["CodiceSede"].ToArray(),
                IdUtente = Request.Headers["IdUtente"]
            };

            try
            {
                var result = _handlerAllerta.Handle(query);

                return Ok(result.DataArray);
            }
            catch (Exception e)
            {
                var ex = e.GetBaseException();

                return BadRequest(ex.Message + ex.StackTrace);
            }
        }
    }
}
