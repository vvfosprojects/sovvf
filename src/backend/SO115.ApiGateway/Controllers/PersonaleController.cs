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
    public class PersonaleController : ControllerBase
    {
        /// <summary>
        ///   Controller che si occuperà di gestire tutte le informazioni riguardanti il Personale
        ///   mettendo insieme le informaizoni reperite dalle API Servizi e IdentityManagement e
        ///   restituendole al FrontEnd
        /// </summary>
    }
}
