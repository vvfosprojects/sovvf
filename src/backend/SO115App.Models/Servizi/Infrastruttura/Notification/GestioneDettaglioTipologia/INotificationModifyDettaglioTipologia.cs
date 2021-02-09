using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.ModificaDettaglioTipologia;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia
{
    public interface INotificationModifyDettaglioTipologia
    {
        Task SendNotification(ModifyDettaglioTipologiaCommand chiamata);
    }
}
