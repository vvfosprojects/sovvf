using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza
{
    public interface INotificationAnnullaRichiestaSoccorsoAereo
    {
        Task SendNotification(AnnullaRichiestaSoccorsoAereoCommand command);
    }
}
