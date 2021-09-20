using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.InsertDoc;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDocumentale
{
    public interface INotificationAddDoc
    {
        public Task SendNotification(AddDocCommand command);
    }
}
