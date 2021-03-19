using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia
{
    public interface INotificationAddDettaglioTipologia
    {
        Task SendNotification(AddDettaglioTipologiaCommand chiamata);
    }
}
