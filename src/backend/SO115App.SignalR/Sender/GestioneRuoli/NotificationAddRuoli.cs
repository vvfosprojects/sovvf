using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationAddRuoli : INotifyAddRuoli
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;
        private readonly IConfiguration _config;

        public NotificationAddRuoli(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF, IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
            _config = config;
        }

        public async Task Notify(AddRuoliUtenteCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var utente = _getUtenteByCF.Get(command.CodFiscale);

            await hubConnection.StartAsync();
            await hubConnection.InvokeAsync("NotifyModificatoRuoloUtente", utente.Id, command.CodiceSede);
            await hubConnection.StopAsync();
        }
    }
}
