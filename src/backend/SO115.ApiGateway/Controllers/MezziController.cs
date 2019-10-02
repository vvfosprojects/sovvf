using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SO115.ApiGateway.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MezziController : ControllerBase
    {
        /// <summary>
        ///   Controller che si occuperà di gestire tutte le informazioni riguardanti i Mezzi
        ///   mettendo insieme le informaizoni reperite dalle API GAC e GEOFLEET e restituendole al FrontEnd
        /// </summary>
    }
}
