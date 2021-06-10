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

        [HttpGet("GetAllSquadre")]
        public async Task<IActionResult> GetAllSquadre(string[] codiciSede)
        {
            if (codiciSede != null)
            {
                var query = new GetAllSquadreQuery()
                {
                    CodiciSede = codiciSede
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
