using SO115App.Models.Classi.Emergenza;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza
{
    public interface INotifyCraTreeData
    {
        public void Send(CraTreeData data);
    }
}
