using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEntiIntervenuti;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneFonogramma
{
    public class NotificationAddEntiIntervenuti : INotifyAddEntiIntervenuti
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddEntiIntervenuti(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(EntiIntervenutiCommand command)
        {
            //Metto a null la richiesta, perchè al FE non serve, sarebbe un parametro inutile
            //command.Richiesta = null;
            await _notificationHubContext.Clients.All.SendAsync("ModifyAndNotifySuccess", command);
        }
    }
}
