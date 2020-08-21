using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento
{
    public class DeleteTrasferimentoNotifier : ICommandNotifier<DeleteTrasferimentoCommand>
    {
        private readonly INotificationDeleteTrasferimento _notifier;
        public DeleteTrasferimentoNotifier(INotificationDeleteTrasferimento notifier) => _notifier = notifier;

        public void Notify(DeleteTrasferimentoCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
