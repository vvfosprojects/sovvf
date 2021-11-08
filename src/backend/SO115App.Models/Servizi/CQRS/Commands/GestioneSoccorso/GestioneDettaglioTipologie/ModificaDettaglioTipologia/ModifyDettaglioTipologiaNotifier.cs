using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia
{
    public class ModifyDettaglioTipologiaNotifier : ICommandNotifier<ModifyDettaglioTipologiaCommand>
    {
        private readonly INotificationModifyDettaglioTipologia _notifier;

        public ModifyDettaglioTipologiaNotifier(INotificationModifyDettaglioTipologia notifier) => _notifier = notifier;

        public void Notify(ModifyDettaglioTipologiaCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
