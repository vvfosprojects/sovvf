using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte
{
    public class UpdateEnteNotifier : ICommandNotifier<UpdateEnteCommand>
    {
        INotificationUpdateEnte _notifier;
        public UpdateEnteNotifier(INotificationUpdateEnte notifier) => _notifier = notifier;

        public void Notify(UpdateEnteCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
