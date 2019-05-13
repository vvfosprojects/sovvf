using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Navbar;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar;
using System.Linq;
using System.Net;
using System.Security.Principal;
using System.Threading.Tasks;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class NavbarController : ControllerBase
    {
        private readonly IQueryHandler<NavbarQuery, NavbarResult> handler;
        private readonly IHubContext<NotificationHub> _NotificationHub;
        private readonly IPrincipal _currentUser;
        private readonly NotificationHub notifyHub = new NotificationHub();

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public NavbarController(IPrincipal currentUser,IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<NavbarQuery, NavbarResult> handler)
        {
            this.handler = handler;
            _NotificationHub = NotificationHubContext;
            _currentUser = currentUser;
        }

        /// <summary>
        ///   Metodo di accesso alle richieste di assistenza
        /// </summary>
        /// <param name="filtro">Il filtro per le richieste</param>
        /// <returns>Le sintesi delle richieste di assistenza</returns>
        [HttpGet]
        public async Task<IActionResult> Get()
        {

            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            var query = new NavbarQuery()
            {
                FiltroBox = ""
            };

            try
            {
                Navbar navbar = new Navbar();
                navbar = (Navbar)this.handler.Handle(query).Navbar;

                await _NotificationHub.Clients.Client(ConId).SendAsync("NotifyGetNavbar", navbar);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}