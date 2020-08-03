using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationAddEnte : INotificationAddEnte
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<RubricaQuery, RubricaResult> _rubricaQueryHandler;
        public NotificationAddEnte(IQueryHandler<RubricaQuery, RubricaResult> rubricaQueryHandler,
            IHubContext<NotificationHub> notificationHubContext)
        {
            _rubricaQueryHandler = rubricaQueryHandler;
            _notificationHubContext = notificationHubContext;
        }

        public async Task SendNotification(AddEnteCommand command)
        {
            var ente = _rubricaQueryHandler.Handle(new RubricaQuery() { IdOperatore = command.idOperatore, IdSede = command.CodiceSede });

            foreach (var sede in ente.Rubrica.Select(c => c.CodSede))
                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", ente);
        }
    }
}
