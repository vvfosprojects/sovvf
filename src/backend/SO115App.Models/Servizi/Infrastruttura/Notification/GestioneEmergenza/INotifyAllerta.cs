
using SO115App.Models.Classi.Emergenza;


namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza
{
    public interface INotifyAllerta
    {
        public void Send(Emergenza emergenza);
    }
}
