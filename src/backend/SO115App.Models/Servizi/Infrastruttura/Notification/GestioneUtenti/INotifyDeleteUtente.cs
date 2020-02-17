using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti
{
    public interface INotifyDeleteUtente
    {
        Task Notify(DeleteUtenteCommand command);
    }
}
