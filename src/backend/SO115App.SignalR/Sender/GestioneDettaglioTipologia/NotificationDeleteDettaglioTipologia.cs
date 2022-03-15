using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneDettaglioTipologia
{
    public class NotificationDeleteDettaglioTipologia : INotificationDeleteDettaglioTipologia
    {
        private GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetListaDettaglioTipologia _getDettaglioTipologia;
        private readonly IConfiguration _config;

        public NotificationDeleteDettaglioTipologia(GetGerarchiaToSend getGerarchiaToSend,
            IGetListaDettaglioTipologia getDettaglioTipologia, IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getDettaglioTipologia = getDettaglioTipologia;
            _config = config;
        }

        public async Task SendNotification(DeleteDettaglioTipologiaCommand dettaglioTipologia)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = _getGerarchiaToSend.Get(dettaglioTipologia.CodiceSede[0]);

            DettaglioTipologiaQuery query = new DettaglioTipologiaQuery()
            {
                IdSede = dettaglioTipologia.CodiceSede,
                Filters = new Models.Classi.Filtri.FiltriDettaglioTipologia() { Search = "" },
            };

            var listaDettagliTipologia = _getDettaglioTipologia.Get(query);

            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyDeleteDettaglioTipologia", new
                {
                    Data = dettaglioTipologia.CodDettaglioTipologia,
                    Pagination = new Paginazione() { TotalItems = listaDettagliTipologia.Count }
                }, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
