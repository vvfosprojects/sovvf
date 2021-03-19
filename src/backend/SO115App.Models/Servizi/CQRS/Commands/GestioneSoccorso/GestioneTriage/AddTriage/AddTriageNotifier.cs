using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTriage.AddTriage
{
    public class AddTriageNotifier : ICommandNotifier<AddTriageCommand>
    {
        private readonly INotificationAddTriage _notifier;

        public AddTriageNotifier(INotificationAddTriage notifier) => _notifier = notifier;

        public void Notify(AddTriageCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
