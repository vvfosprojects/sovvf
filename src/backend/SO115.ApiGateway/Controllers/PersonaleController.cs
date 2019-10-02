using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SO115App.ApiGateway.Classi;
using SO115App.ApiGateway.Servizi;

namespace SO115.ApiGateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PersonaleController : ControllerBase
    {
        private readonly PersonaleService prsonaleService;

        /// <summary>
        ///   Controller che si occuperà di gestire tutte le informazioni riguardanti il Personale
        ///   mettendo insieme le informaizoni reperite dalle API Servizi e IdentityManagement e
        ///   restituendole al FrontEnd
        /// </summary>
        public PersonaleController(PersonaleService prsonaleService)
        {
            this.prsonaleService = prsonaleService;
        }

        [HttpGet("{codiceSede}/{codiceTurno}")]
        public async Task<List<SquadreNelTurno>> GetSquadreNelTurno([FromQuery]string codiceSede, string codiceTurno)
        {
            List<SquadreNelTurno> Turno = await prsonaleService.GetSquadreNelTurno(codiceSede, codiceTurno);

            return Turno;
        }

        [HttpGet("{codiceSede}")]
        public async Task<List<SquadreNelTurno>> GetSquadreBySede([FromQuery]string codiceSede)
        {
            List<SquadreNelTurno> Turno = await prsonaleService.GetSquadreBySede(codiceSede);

            return Turno;
        }
    }
}
