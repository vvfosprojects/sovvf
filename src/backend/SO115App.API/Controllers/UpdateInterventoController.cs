using System.Collections.Generic;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.AddIntervento;
using DomainModel.CQRS.Commands.UpDateIntervento;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Command.GestioneSoccorso.Shared;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UpdateInterventoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<UpDateInterventoCommand> _handler;

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _SintesiRichiesteAssistenzaMarkerhandler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public UpdateInterventoController(
            IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
            ICommandHandler<UpDateInterventoCommand> handler)
        {
            _handler = handler;
            _NotificationHub = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _SintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
        }

        [HttpPost]
        public async Task<IActionResult> UpdateIntervento([FromBody]Intervento chiamata)
        {
            if (ModelState.IsValid)
            {
                var command = new UpDateInterventoCommand()
                {
                    Chiamata = chiamata
                };

                try
                {
                    this._handler.Handle(command);
                    await _NotificationHub.Clients.Group(chiamata.Operatore.Sede.Codice).SendAsync("ModifyAndNotifySuccess", command);

                    var BoxRichiestequery = new BoxRichiesteQuery();
                    BoxInterventi boxInterventi = new BoxInterventi();
                    boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
                    await _NotificationHub.Clients.Group(chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                    var query = new SintesiRichiesteAssistenzaMarkerQuery();
                    List<SintesiRichiestaMarker> listaSintesiMarker = new List<SintesiRichiestaMarker>();
                    listaSintesiMarker = (List<SintesiRichiestaMarker>)this._SintesiRichiesteAssistenzaMarkerhandler.Handle(query).SintesiRichiestaMarker;
                    await _NotificationHub.Clients.Group(chiamata.Operatore.Sede.Codice).SendAsync("NotifyGetListaRichiesteMarker", listaSintesiMarker);

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
