using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes.ResultDTO;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BoxRichiesteController: ControllerBase
    {

        private readonly IBoxRichiesteQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public BoxRichiesteController(IHubContext<NotificationHub> NotificationHubContext,            
            IBoxRichiesteQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> handler)
        {            
            this.handler = handler;
            _NotificationHub = NotificationHubContext;

        }
        
          /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>    
        [HttpGet]
        public async Task<IActionResult> Get()
        {
           
            var query = new BoxRichiesteQuery()
            {
                FiltroBox = ""
            };

            return Ok(this.handler.Handle(query));
        }

    }
}