using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTrasferimentiChiamate
{
    public class NotificationAddTrasferimento : INotificationAddTrasferimento
    {
        public Task SendNotification(AddTrasferimentoCommand command)
        {
            return null;
        }
    }
}
