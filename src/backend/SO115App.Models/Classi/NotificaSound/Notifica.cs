using System.Collections.Generic;

namespace SO115App.Models.Classi.NotificaSoundModale
{
    public class Notifica
    {
        public TipoNotifica NotificaType { get; set; }
    }

    public class NotificaModal
    {
        public DataModal data { get; set; }
    }

    public class DataModal
    {
        public string title { get; set; }
        public string text { get; set; }
        public List<Button> buttons { get; set; }
        public int timeToClose { get; set; }
    }

    public class Button
    {
        public string bgColor { get; set; }
        public string text { get; set; }
    }
}
