using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiMezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiSediMarker;

namespace SO115App.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class WelcomeController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _NotificationHubContext;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _BoxMezzihandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _BoxPersonalehandler;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> _SintesiMezziMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _SintesiRichiesteAssistenzahandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _SintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> _SintesiSediMarkerhandler;

        public WelcomeController(
            IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> BoxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> BoxPersonalehandler,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<SintesiMezziMarkerQuery, SintesiMezziMarkerResult> SintesiMezziMarkerhandler,
            IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> SintesiRichiesteAssistenzahandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> SintesiRichiesteAssistenzaMarkerhandler,
            IQueryHandler<SintesiSediMarkerQuery, SintesiSediMarkerResult> SintesiSediMarkerhandler
            )
        {
            this._NotificationHubContext = NotificationHubContext;
            this._BoxMezzihandler = BoxMezzihandler;
            this._BoxPersonalehandler = BoxPersonalehandler;
            this._BoxRichiestehandler = BoxRichiestehandler;
            this._SintesiMezziMarkerhandler = SintesiMezziMarkerhandler;
            this._SintesiRichiesteAssistenzahandler = SintesiRichiesteAssistenzahandler;
            this._SintesiRichiesteAssistenzaMarkerhandler = SintesiRichiesteAssistenzaMarkerhandler;
            this._SintesiSediMarkerhandler = SintesiSediMarkerhandler;
        }

        /// <summary>
        ///   Metodo di accesso a tutte le informazioni riguardanti il primo caricamento della Home Page
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            try
            {
                var BoxMezziquery = new BoxMezziQuery();
                BoxMezzi boxMezzi = new BoxMezzi();
                boxMezzi = (BoxMezzi)this._BoxMezzihandler.Handle(BoxMezziquery).BoxMezzi;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetBoxMezzi", boxMezzi);

                var BoxPersonalequery = new BoxPersonaleQuery();
                BoxPersonale boxPersonale = new BoxPersonale();
                boxPersonale = (BoxPersonale)this._BoxPersonalehandler.Handle(BoxPersonalequery).BoxPersonale;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetBoxPersonale", boxPersonale);

                var BoxRichiestequery = new BoxRichiesteQuery();
                BoxInterventi boxInterventi = new BoxInterventi();
                boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                var SintesiMezziMarkerquery = new SintesiMezziMarkerQuery();
                List<SintesiMezzoMarker> listaMezzi = new List<SintesiMezzoMarker>();
                listaMezzi = (List<SintesiMezzoMarker>)this._SintesiMezziMarkerhandler.Handle(SintesiMezziMarkerquery).SintesiMezziMarker;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetListaMezziMarker", listaMezzi);

                var SintesiRichiesteAssistenzaquery = new SintesiRichiesteAssistenzaQuery();
                List<SintesiRichieste> listaSintesi = new List<SintesiRichieste>();
                listaSintesi = (List<SintesiRichieste>)this._SintesiRichiesteAssistenzahandler.Handle(SintesiRichiesteAssistenzaquery).SintesiRichiesta;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetListaRichieste", listaSintesi);

                var query = new SintesiRichiesteAssistenzaMarkerQuery();
                List<SintesiRichiestaMarker> listaSintesiMarker = new List<SintesiRichiestaMarker>();
                listaSintesiMarker = (List<SintesiRichiestaMarker>)this._SintesiRichiesteAssistenzaMarkerhandler.Handle(query).SintesiRichiestaMarker;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetListaRichiesteMarker", listaSintesiMarker);

                var SintesiSediMarkerquery = new SintesiSediMarkerQuery();
                List<SintesiSedeMarker> listaSintesiSediMarker = new List<SintesiSedeMarker>();
                listaSintesiSediMarker = (List<SintesiSedeMarker>)this._SintesiSediMarkerhandler.Handle(SintesiSediMarkerquery).SintesiSediMarker;
                await _NotificationHubContext.Clients.Client(ConId).SendAsync("NotifyGetListaSediMarker", listaSintesiSediMarker);

                return Ok();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
