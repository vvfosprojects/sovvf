using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class GestioneSediController : ControllerBase
    {
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public GestioneSediController(IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        //[HttpGet("GetAllSedi")]
        //public Task<IActionResult> GetAllSedi()
        //{
        //    return Ok(_getAlberaturaUnitaOperative.ListaSediAlberata());
        //}
    }
}
