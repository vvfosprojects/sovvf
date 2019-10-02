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
    public class UtilityController : ControllerBase
    {
        /// <summary>
        ///   Controller che si occuperà di gestire tutte le informazioni riguardanti serivizi
        ///   definiti UTILITY ( es. Territorio, Sedi, Cap )
        /// </summary>

        private readonly TerritorioService territorioService;

        public UtilityController(TerritorioService territorioService)
        {
            this.territorioService = territorioService;
        }

        [HttpGet]
        public async Task<List<Regione>> GetAlberaturaIstat()
        {
            List<Regione> ListaRegioni = await territorioService.ListaAlberaturaRegioni();

            return ListaRegioni;
        }
    }
}
