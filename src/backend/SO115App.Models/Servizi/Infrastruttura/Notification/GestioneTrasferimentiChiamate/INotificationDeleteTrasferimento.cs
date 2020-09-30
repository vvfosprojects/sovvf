using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.DeleteTrasferimento;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate
{
    public interface INotificationDeleteTrasferimento
    {
        Task SendNotification(DeleteTrasferimentoCommand command);
    }
}
