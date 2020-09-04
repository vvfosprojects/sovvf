using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.ModificaPartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationModificaPartenza : INotifyModificaPartenza
    {
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        public NotificationModificaPartenza()
        {

        }

        public Task SendNotification(ModificaPartenzaCommand command)
        {
            throw new System.NotImplementedException();
        }
    }
}
