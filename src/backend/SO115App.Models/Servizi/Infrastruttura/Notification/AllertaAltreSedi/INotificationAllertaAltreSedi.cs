using DomainModel.CQRS.Commands.AllertaAltreSedi;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.AllertaAltreSedi
{
    public interface INotificationAllertaAltreSedi
    {
        Task SendNotification(AllertaAltreSediCommand command);
    }
}
