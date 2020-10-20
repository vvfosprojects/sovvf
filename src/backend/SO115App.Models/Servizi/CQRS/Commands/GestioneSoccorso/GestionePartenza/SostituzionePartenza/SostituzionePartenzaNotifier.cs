using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SostituzionePartenza
{
    public class SostituzionePartenzaNotifier : ICommandNotifier<SostituzionePartenzaCommand>
    {
        private readonly INotifyModificaPartenza _notifier;

        public SostituzionePartenzaNotifier(INotifyModificaPartenza notifier) => _notifier = notifier;

        public void Notify(SostituzionePartenzaCommand command)
        {
            var modificaPartenza = new ModificaPartenzaCommand()
            {
                CodSede = command.Richiesta.CodSOCompetente,
                IdOperatore = command.sostituzione.idOperatore,
                Richiesta = command.Richiesta
            };

            _notifier.SendNotification(modificaPartenza);
        }
    }
}
