using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTrasferimentiChiamate
{
    public class NotificationDeleteTrasferimento : INotificationDeleteTrasferimento
    {
        public Task SendNotification(DeleteTrasferimentoCommand command)
        {
            return null;
        }
    }
}
