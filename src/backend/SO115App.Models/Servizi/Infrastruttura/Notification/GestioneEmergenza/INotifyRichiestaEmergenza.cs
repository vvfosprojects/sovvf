using SO115App.Models.Classi.Emergenza;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza
{
    public interface INotifyRichiestaEmergenza
    {
        void Send(Emergenza emergenza);
    }
}
