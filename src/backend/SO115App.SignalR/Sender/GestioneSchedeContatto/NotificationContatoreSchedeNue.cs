using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationContatoreSchedeNue : INotificationContatoreSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetConteggioSchede _getConteggioSchede;
        private readonly IConfiguration _config;

        public NotificationContatoreSchedeNue(
            IHubContext<NotificationHub> notificationHubContext,
            IGetConteggioSchede getConteggioSchede, IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchede = getConteggioSchede;
            _config = config;
        }

        public async Task SendNotification(string CodSede)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var infoNue = _getConteggioSchede.GetConteggio(new string[] { CodSede });

            await hubConnection.StartAsync();
            await hubConnection.InvokeAsync("NotifyGetContatoriSchedeContatto", infoNue);
            await hubConnection.StopAsync();
        }
    }
}
