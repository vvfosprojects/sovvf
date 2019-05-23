using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.AddIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;

namespace SO115App.API.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InserimentoInterventoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<AddInterventoCommand> _handler;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public InserimentoInterventoController(
            IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            ICommandHandler<AddInterventoCommand> handler)
        {
            this._handler = handler;
            _NotificationHub = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
        }

        [HttpPost]
        public async Task<IActionResult> InserimentoIntervento([FromBody]InserimentoChiamata chiamata)
        {
            if(ModelState.IsValid)
            {
                var command = new AddInterventoCommand()
                {
                    Chiamata = chiamata
                };

                try
                {
                    this._handler.Handle(command);
                    await _NotificationHub.Clients.Group(chiamata.Operatore.Sede.Codice).SendAsync("SaveAndNotifySuccessChiamata", command);

                    var BoxRichiestequery = new BoxRichiesteQuery();
                    BoxInterventi boxInterventi = new BoxInterventi();
                    boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
                    await _NotificationHub.Clients.Group(chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                    return Ok();
                }
                catch
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }
    }
}