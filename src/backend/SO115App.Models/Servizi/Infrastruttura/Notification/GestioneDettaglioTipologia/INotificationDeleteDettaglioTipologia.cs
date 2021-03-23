using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.DeleteDettaglioTipologia;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia
{
    public interface INotificationDeleteDettaglioTipologia
    {
        Task SendNotification(DeleteDettaglioTipologiaCommand chiamata);
    }
}
