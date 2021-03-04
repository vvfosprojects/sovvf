using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia
{
    public class AddDettaglioTipologiaNotifier : ICommandNotifier<AddDettaglioTipologiaCommand>
    {
        private readonly INotificationAddDettaglioTipologia _notifier;

        public AddDettaglioTipologiaNotifier(INotificationAddDettaglioTipologia notifier) => _notifier = notifier;

        public void Notify(AddDettaglioTipologiaCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
