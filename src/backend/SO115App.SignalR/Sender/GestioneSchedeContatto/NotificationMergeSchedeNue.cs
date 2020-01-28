using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.MergeSchedeNue;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationMergeSchedeNue : INotificationMergeSchedeNue
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> _getConteggioSchedeHandler;

        public NotificationMergeSchedeNue(
            IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<GetConteggioSchedeQuery, GetConteggioSchedeResult> getConteggioSchedeHandler)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchedeHandler = getConteggioSchedeHandler;
        }

        public async Task SendNotification(MergeSchedeNueCommand command)
        {
            var getConteggioSchedeQuery = new GetConteggioSchedeQuery
            {
                CodiceSede = command.CodiceSede
            };

            var infoNue = _getConteggioSchedeHandler.Handle(getConteggioSchedeQuery).InfoNue;
            await _notificationHubContext.Clients.Group(command.CodiceSede).SendAsync("NotifyGetContatoriSchedeContatto", infoNue);
            await _notificationHubContext.Clients.Groups(command.CodiceSede).SendAsync("NotifyUpdateSchedaContatto", command.SchedaNue);

            var CodiciShedecollegate = new string[command.SchedaNue.Collegate.Count];
            int i = 0;

            foreach (var schedaCollegata in command.SchedaNue.Collegate)
            {
                CodiciShedecollegate[i] = schedaCollegata.CodiceScheda;
                i++;
            }

            await _notificationHubContext.Clients.Groups(command.CodiceSede).SendAsync("NotifyRemoveSchedeContatto", CodiciShedecollegate);
        }
    }
}
