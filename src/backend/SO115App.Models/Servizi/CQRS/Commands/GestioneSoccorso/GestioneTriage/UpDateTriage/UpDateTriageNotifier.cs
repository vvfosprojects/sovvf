using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.UpDateTriage
{
    public class UpDateTriageNotifier : ICommandNotifier<UpDateTriageCommand>
    {
        private readonly INotificationUpDateTriage _notifier;

        public UpDateTriageNotifier(INotificationUpDateTriage notifier) => _notifier = notifier;

        public void Notify(UpDateTriageCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
