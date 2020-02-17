using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli
{
    public interface INotifyDeleteRuolo
    {
        Task Notify(DeleteRuoliUtenteCommand command);
    }
}
