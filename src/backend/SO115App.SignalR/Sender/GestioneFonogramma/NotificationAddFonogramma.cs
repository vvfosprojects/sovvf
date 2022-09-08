using DomainModel.CQRS.Commands.GestioneFonogramma;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneFonogramma;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneFonogramma
{
    public class NotificationAddFonogramma : INotifyAddFonogramma
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;

        public NotificationAddFonogramma(IHubContext<NotificationHub> notificationHubContext, IGetSintesiRichiestaAssistenzaByCodice getSintesiById)
        {
            _notificationHubContext = notificationHubContext;
            _getSintesiById = getSintesiById;
        }

        public async Task SendNotification(FonogrammaCommand command)
        {
            command.Chiamata = _getSintesiById.GetSintesi(command.Richiesta.Codice);
            //Metto a null la richiesta, perchè al FE non serve, sarebbe un parametro inutile
            command.Richiesta = null;

            await _notificationHubContext.Clients.All.SendAsync("ModifyAndNotifySuccess", command);
        }
    }
}
