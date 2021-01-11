using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo
{
    public class InserisciRichiestaSoccorsoAereoNotifier : ICommandNotifier<InserisciRichiestaSoccorsoAereoCommand>
    {
        private readonly INotificationInserisciRichiestaSoccorsoAereo _notifier;
        public InserisciRichiestaSoccorsoAereoNotifier(INotificationInserisciRichiestaSoccorsoAereo notifier)
        {
            _notifier = notifier;
        }

        public void Notify(InserisciRichiestaSoccorsoAereoCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
