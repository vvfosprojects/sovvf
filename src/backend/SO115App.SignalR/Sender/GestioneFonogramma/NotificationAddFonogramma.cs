using DomainModel.CQRS.Commands.GestioneFonogramma;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneFonogramma;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneFonogramma
{
    public class NotificationAddFonogramma : INotifyAddFonogramma
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaAssistenzaByCodice;

        public NotificationAddFonogramma(IHubContext<NotificationHub> notificationHubContext,
            IGetRichiestaById getRichiestaById,
            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaAssistenzaByCodice)
        {
            _notificationHubContext = notificationHubContext;
            _getRichiestaById = getRichiestaById;
            _getSintesiRichiestaAssistenzaByCodice = getSintesiRichiestaAssistenzaByCodice;
        }

        public async Task SendNotification(FonogrammaCommand command)
        {
            var richiesta = _getRichiestaById.GetById(command.Fonogramma.IdRichiesta);
            var sintesi = _getSintesiRichiestaAssistenzaByCodice.GetSintesi(richiesta.Codice);

            await _notificationHubContext.Clients.All.SendAsync("NotifyInfoFonogramma", sintesi);
        }
    }
}
