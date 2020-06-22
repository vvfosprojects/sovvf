using SO115App.Models.Classi.Matrix;

namespace SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix
{
    public interface ICallMatrix
    {
        public void SendMessage(MessageMatrix sintesi);
    }
}
