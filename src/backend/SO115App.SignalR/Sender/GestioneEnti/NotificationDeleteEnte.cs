using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationDeleteEnte : INotificationDeleteEnte
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<RubricaQuery, RubricaResult> _rubricaQueryHandler;
        public NotificationDeleteEnte(IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler,
            IHubContext<NotificationHub> notificationHubContext)
        {
            _rubricaQueryHandler = rubricaQueryHandler;
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(DeleteEnteCommand command)
        {
            var ente = _rubricaQueryHandler.Handle(new RubricaQuery() { IdOperatore = command.idOperatore, IdSede = command.CodiceSede });

            foreach (var sede in ente.Rubrica.Select(c => c.CodSede))
                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", ente);
        }
    }
}
