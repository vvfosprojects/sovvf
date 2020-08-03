using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte
{
    public class DeleteEnteNotifier : ICommandNotifier<DeleteEnteCommand>
    {
        INotificationDeleteEnte _notifier;
        public DeleteEnteNotifier(INotificationDeleteEnte notifier) => _notifier = notifier;

        public void Notify(DeleteEnteCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
