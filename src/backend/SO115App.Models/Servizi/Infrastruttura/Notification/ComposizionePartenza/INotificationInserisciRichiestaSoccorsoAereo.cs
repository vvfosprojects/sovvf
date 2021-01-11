using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza
{
    public interface INotificationInserisciRichiestaSoccorsoAereo
    {
        Task SendNotification(InserisciRichiestaSoccorsoAereoCommand command);
    }
}
