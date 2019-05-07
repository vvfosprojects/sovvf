using System.Net;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BoxRichiesteController: ControllerBase
    {

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public BoxRichiesteController(IHubContext<NotificationHub> NotificationHubContext,            
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> handler)
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
        public async Task<IActionResult> Get(string id)
        {
           
            var query = new BoxRichiesteQuery()
            {
                FiltroBox = ""
            };

            try{
                BoxInterventi boxInterventi = new BoxInterventi();
                boxInterventi = (BoxInterventi)this.handler.Handle(query).BoxRichieste;

                await _NotificationHub.Clients.Client(id).SendAsync("NotifyGetBoxInterventi", boxInterventi);             

                return Ok();

            }catch{
                return Ok(HttpStatusCode.BadRequest);
            }            

        }

    }
}