using DomainModel.CQRS.Commands.GestioneFonogramma;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneFonogramma;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneFonogramma
{
    public class NotificationAddFonogramma : INotifyAddFonogramma
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddFonogramma(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(FonogrammaCommand command)
        {
            //Metto a null la richiesta, perchè al FE non serve, sarebbe un parametro inutile
            command.Richiesta = null;
            await _notificationHubContext.Clients.All.SendAsync("ModifyAndNotifySuccess", command);
        }
    }
}
