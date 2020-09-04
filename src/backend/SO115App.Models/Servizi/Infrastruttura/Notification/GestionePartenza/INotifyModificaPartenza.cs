using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza
{
    public interface INotifyModificaPartenza
    {
        Task SendNotification(ModificaPartenzaCommand command);
    }
}
