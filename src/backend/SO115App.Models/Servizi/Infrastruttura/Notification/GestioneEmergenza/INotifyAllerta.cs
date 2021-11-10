
using SO115App.Models.Classi.Emergenza;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza
{
    public interface INotifyAllerta
    {
       Task Send(Emergenza emergenza);
    }
}
