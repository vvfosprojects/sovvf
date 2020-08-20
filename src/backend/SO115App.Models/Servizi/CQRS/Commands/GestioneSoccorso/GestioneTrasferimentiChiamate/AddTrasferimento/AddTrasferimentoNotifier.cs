using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoNotifier : ICommandNotifier<AddTrasferimentoCommand>
    {
        private readonly INotificationAddTrasferimento _notifier;
        public AddTrasferimentoNotifier(INotificationAddTrasferimento notifier) => _notifier = notifier;

        public void Notify(AddTrasferimentoCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
