using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte
{
    public class AddEnteNotifier : ICommandNotifier<AddEnteCommand>
    {
        private readonly INotificationAddEnte _notifier;
        public AddEnteNotifier(INotificationAddEnte notifier) => _notifier = notifier;

        public void Notify(AddEnteCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
