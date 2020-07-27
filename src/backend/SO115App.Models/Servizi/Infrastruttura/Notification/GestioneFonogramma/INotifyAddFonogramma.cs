using DomainModel.CQRS.Commands.GestioneFonogramma;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneFonogramma
{
    public interface INotifyAddFonogramma
    {
        Task SendNotification(FonogrammaCommand chiamata);
    }
}
