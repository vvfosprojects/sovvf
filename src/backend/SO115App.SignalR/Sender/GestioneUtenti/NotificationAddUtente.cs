using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneUtenti
{
    public class NotificationAddUtente : INotifyAddUtente
    {
        public Task Notify(AddUtenteCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
