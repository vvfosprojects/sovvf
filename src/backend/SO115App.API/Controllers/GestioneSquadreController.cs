using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSquadre.GetAllSquadre;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSquadreController : ControllerBase
    {
        private readonly IQueryHandler<GetAllSquadreQuery, GetAllSquadreResult> _getAllSquadreHandler;

        public GestioneSquadreController(IQueryHandler<GetAllSquadreQuery, GetAllSquadreResult> getAllSquadreHandler)
        {
            _getAllSquadreHandler = getAllSquadreHandler;
        }

        [HttpPost("GetAllSquadre")]
        public async Task<IActionResult> GetAllSquadre([FromBody] GetAllSquadreQuery par)
        {
            if (par.CodiciSede != null)
            {
                var query = new GetAllSquadreQuery()
                {
                    CodiciSede = par.CodiciSede
                };

                var result = _getAllSquadreHandler.Handle(query);

                return Ok(result);
            }
            else
            {
                var query = new GetAllSquadreQuery()
                {
                    CodiciSede = Request.Headers["codicesede"].ToString().Split(",")
                };

                var result = _getAllSquadreHandler.Handle(query);

                return Ok(result);
            }
        }
    }
}
