using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEntiIntervenuti
{
    public interface INotifyAddEntiIntervenuti
    {
        Task SendNotification(EntiIntervenutiCommand chiamata);
    }
}
