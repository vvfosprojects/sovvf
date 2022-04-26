using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationDeleteUtente : INotifyDeleteUtente
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;
        private readonly IConfiguration _config;

        public NotificationDeleteUtente(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF, IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
            _config = config;
        }

        public async Task Notify(DeleteUtenteCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            await hubConnection.StartAsync();
            await hubConnection.InvokeAsync("NotifyDeleteUtente", command.UtenteRimosso.Id);
            await hubConnection.StopAsync();
        }
    }
}
