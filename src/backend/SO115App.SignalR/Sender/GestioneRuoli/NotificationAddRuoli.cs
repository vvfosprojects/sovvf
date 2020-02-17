using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationAddRuoli : INotifyAddRuoli
    {
        public Task Notify(AddRuoliUtenteCommand command)
        {
            throw new NotImplementedException();
        }
    }
}
