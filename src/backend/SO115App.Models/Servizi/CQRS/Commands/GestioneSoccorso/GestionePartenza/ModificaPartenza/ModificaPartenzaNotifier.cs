using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza
{
    public class ModificaPartenzaNotifier : ICommandNotifier<ModificaPartenzaCommand>
    {
        private readonly INotifyModificaPartenza _notifier;
        public ModificaPartenzaNotifier(INotifyModificaPartenza notifier) => _notifier = notifier;

        public void Notify(ModificaPartenzaCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
