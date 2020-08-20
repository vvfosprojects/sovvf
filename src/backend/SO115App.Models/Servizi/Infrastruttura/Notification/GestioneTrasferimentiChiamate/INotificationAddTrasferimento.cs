using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate
{
    public interface INotificationAddTrasferimento
    {
        Task SendNotification(AddTrasferimentoCommand command);
    }
}
