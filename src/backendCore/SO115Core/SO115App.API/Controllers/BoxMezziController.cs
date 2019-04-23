using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes.ResultDTO;

namespace SO115App.API.Controllers
{
    [Authorize]  
    [Route("api/[controller]")]
    [ApiController]
    public class BoxMezziController: ControllerBase
    {

        private readonly  IBoxMezziQueryHandler<BoxMezziQuery, BoxMezziResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public BoxMezziController(IHubContext<NotificationHub> NotificationHubContext,            
            IBoxMezziQueryHandler<BoxMezziQuery, BoxMezziResult> handler)
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
           
            var query = new BoxMezziQuery()
            {
                FiltroBox = ""
            };

            try{
                BoxMezzi boxMezzi = new BoxMezzi();
                boxMezzi = (BoxMezzi)this.handler.Handle(query).BoxMezzi;

                await _NotificationHub.Clients.Client(id).SendAsync("NotifyGetBoxMezzi", boxMezzi);             

                return Ok();
                
            }catch
            {
                return Ok(HttpStatusCode.BadRequest);
            }
        }

    }
}