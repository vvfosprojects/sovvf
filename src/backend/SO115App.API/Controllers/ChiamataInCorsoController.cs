using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CQRS.Commands;
using CQRS.Queries;
using DomainModel.CQRS.Commands.ChiamataInCorsoMarker;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Hubs;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.ListaChiamateInCorsoMarker;
using SO115App.Models.Classi.Marker;

namespace SO115App.API.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChiamataInCorsoController : ControllerBase
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly ICommandHandler<ChiamataInCorsoMarkerCommand> _Addhandler;
        private readonly ICommandHandler<CancellazioneChiamataInCorsoMarkerCommand> _Delhandler;
        private readonly ICommandHandler<UpDateChiamataInCorsoMarkerCommand> _upDatehandler;
        private readonly IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> _listaChiamateInCorsoMarkerhandler;
        private readonly IHubContext<NotificationHub> _NotificationHub;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="handler">L'handler iniettato del servizio</param>
        public ChiamataInCorsoController(
            IHubContext<NotificationHub> NotificationHubContext,
            ICommandHandler<ChiamataInCorsoMarkerCommand> Addhandler,
            ICommandHandler<CancellazioneChiamataInCorsoMarkerCommand> Delhandler,
            ICommandHandler<UpDateChiamataInCorsoMarkerCommand> UpDatehandler,
            IQueryHandler<ListaChiamateInCorsoMarkerQuery, ListaChiamateInCorsoMarkerResult> ListaChiamateInCorsoMarkerhandler
            )
        {
            _Addhandler = Addhandler;
            _Delhandler = Delhandler;
            _upDatehandler = UpDatehandler;
            _listaChiamateInCorsoMarkerhandler = ListaChiamateInCorsoMarkerhandler;
            _NotificationHub = NotificationHubContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var headerValues = Request.Headers["HubConnectionId"];
            string ConId = headerValues.FirstOrDefault();

            var Listaquery = new ListaChiamateInCorsoMarkerQuery();
            List<ChiamateInCorso> ListaChiamate = new List<ChiamateInCorso>();

            try
            {
                ListaChiamate = (List<ChiamateInCorso>)this._listaChiamateInCorsoMarkerhandler.Handle(Listaquery).ListaChiamateInCorsoMarker;
                await _NotificationHub.Clients.Client(ConId).SendAsync("NotifyChiamateInCorsoMarker", ListaChiamate);

            return Ok();
            }
            catch
            {
                return BadRequest();
            };

        }

        [HttpPost("Add")]
        public async Task<IActionResult> Add([FromBody]ChiamateInCorso chiamata)
        {
            if(ModelState.IsValid)
            {
                var command = new ChiamataInCorsoMarkerCommand()
                {
                    AddChiamataInCorso = chiamata
                };

                try
                {
                    this._Addhandler.Handle(command);
                    await _NotificationHub.Clients.Group(chiamata.codiceSedeOperatore).SendAsync("NotifyChiamataInCorsoMarkerAdd", command);

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

        [HttpPost("Delete")]
        public async Task<IActionResult> Delete([FromBody]ChiamateInCorso chiamata)
        {
            if (ModelState.IsValid)
            {
                var command = new CancellazioneChiamataInCorsoMarkerCommand()
                {
                    IdChiamataInCorso = chiamata.id
                };

                try
                {
                    this._Delhandler.Handle(command);
                    await _NotificationHub.Clients.Group(chiamata.codiceSedeOperatore).SendAsync("NotifyChiamataInCorsoMarkerDelete", command.IdChiamataInCorso);

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

        [HttpPost("UpDate")]
        public async Task<IActionResult> UpDate([FromBody]ChiamateInCorso chiamata)
        {
            if (ModelState.IsValid)
            {
                var command = new UpDateChiamataInCorsoMarkerCommand()
                {
                    ChiamataInCorso = chiamata
                };

                try
                {
                    this._upDatehandler.Handle(command);
                    await _NotificationHub.Clients.Group(chiamata.codiceSedeOperatore).SendAsync("NotifyChiamataInCorsoMarkerUpDate", command);

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