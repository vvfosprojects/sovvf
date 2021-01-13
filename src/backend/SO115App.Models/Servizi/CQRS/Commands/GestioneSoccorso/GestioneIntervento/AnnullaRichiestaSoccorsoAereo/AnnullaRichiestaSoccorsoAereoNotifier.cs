using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo
{
    public class AnnullaRichiestaSoccorsoAereoNotifier : ICommandNotifier<AnnullaRichiestaSoccorsoAereoCommand>
    {
        private readonly INotificationAnnullaRichiestaSoccorsoAereo _notifier;
        public AnnullaRichiestaSoccorsoAereoNotifier(INotificationAnnullaRichiestaSoccorsoAereo notifier)
        {
            _notifier = notifier;
        }

        public void Notify(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            _notifier.SendNotification(command);
        }
    }
}
