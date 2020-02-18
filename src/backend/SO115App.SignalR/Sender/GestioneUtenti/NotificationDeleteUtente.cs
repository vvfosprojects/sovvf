using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationDeleteUtente : INotifyDeleteUtente
    {
        public Task Notify(DeleteUtenteCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
