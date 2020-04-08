using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti
{
    public interface INotifyAddUtente
    {
        Task Notify(AddUtenteCommand command);
    }
}
