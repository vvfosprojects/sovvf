using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia
{
    public class DeleteDettaglioTipologiaNotifier : ICommandNotifier<DeleteDettaglioTipologiaCommand>
    {
        private readonly INotificationDeleteDettaglioTipologia _notifier;

        public DeleteDettaglioTipologiaNotifier(INotificationDeleteDettaglioTipologia notifier) => _notifier = notifier;

        public void Notify(DeleteDettaglioTipologiaCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
