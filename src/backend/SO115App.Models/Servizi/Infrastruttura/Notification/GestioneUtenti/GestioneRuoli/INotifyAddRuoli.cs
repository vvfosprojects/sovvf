using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli
{
    public interface INotifyAddRuoli
    {
        Task Notify(AddRuoliUtenteCommand command);
    }
}
