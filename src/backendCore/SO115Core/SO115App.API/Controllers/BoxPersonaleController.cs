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
    public class BoxPersonaleController: ControllerBase
    {

        private readonly  IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public BoxPersonaleController(IHubContext<NotificationHub> NotificationHubContext,            
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> handler)
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
           
            var query = new BoxPersonaleQuery()
            {
                FiltroBox = ""
            };

            try{
                BoxPersonale boxPersonale = new BoxPersonale();
                boxPersonale = (BoxPersonale)this.handler.Handle(query).BoxPersonale;

                await _NotificationHub.Clients.Client(id).SendAsync("NotifyGetBoxPersonale", boxPersonale);             

                return Ok();

            }catch{
                return Ok(HttpStatusCode.BadRequest);
            }

            
        }

    }
}