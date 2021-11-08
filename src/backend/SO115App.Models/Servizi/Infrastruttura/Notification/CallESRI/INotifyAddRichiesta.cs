using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.ESRI;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI
{
    public interface INotify_ESRIAddRichiesta
    {
        public void Call(ESRI_RichiestaMessage message, RichiestaAssistenza richiesta);
    }
}
