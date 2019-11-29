using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaGestita;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationSetSchedaGestita : INotificationSetSchedaGestita
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _getConteggioSchedeHandler;
        private readonly IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> _getSchedeContattoHandler;

        public NotificationSetSchedaGestita(
            IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> getConteggioSchedeHandler, IQueryHandler<GetSchedeContattoQuery, GetSchedeContattoResult> getSchedeContatto)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
            _getSchedeContattoHandler = getSchedeContatto;
        }

        public async Task SendNotification(SetSchedaGestitaCommand command)
        {
            var getConteggioSchedeQuery = new GetConteggioSchedeQuery
            {
                CodiceSede = command.CodiceSede
            };

            var getSchedeContatto = new GetSchedeContattoQuery
            {
                CodiceSede = command.CodiceSede
            };

            var schedaContattoUpdated = _getSchedeContattoHandler.Handle(getSchedeContatto).SchedeContatto.Find(x => x.CodiceScheda.Equals(command.CodiceScheda));

            var infoNue = _getConteggioSchedeHandler.Handle(getConteggioSchedeQuery).InfoNue;
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
            await _notificationHubContext.Clients.Groups(command.CodiceSede).SendAsync("NotifyGetUpdateSchedaContatto", schedaContattoUpdated);
        }
    }
}
