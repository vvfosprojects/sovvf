using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.API.DataFake.Services.Sedi;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;

namespace SO115App.API.DataFake.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SediController : ControllerBase
    {
        private readonly IGetCoordinateByCodSede _IgetCoordinate;

        public SediController(IGetCoordinateByCodSede IgetCoordinate)
        {
            this._IgetCoordinate = IgetCoordinate;
        }

        [HttpGet("GetCoordinateByCodSede")]
        public async Task<IActionResult> GetCoordinateByCodSede(string CodSede)
        {
            try
            {
                GetCoordinateByCodSede _getCoordinate = new GetCoordinateByCodSede(_IgetCoordinate);

                return Ok(_getCoordinate.Get(CodSede));
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }

        [HttpGet("GetCompetenzeByProssimita")]
        public async Task<IActionResult> GetCompetenzeByProssimita(Coordinate coordinate)
        {
            try
            {

                return Ok();
            }
            catch (Exception ex)
            {
                if (ex.Message.Contains(Costanti.UtenteNonAutorizzato))
                    return StatusCode(403, Costanti.UtenteNonAutorizzato);
                return BadRequest();
            }
        }


    }
}