using System;

namespace SO115App.Models.Classi.NotificheNavbar
{
    public class Notifica
    {
        public string Titolo { get; set; }
        public string Descrizione { get; set; }
        public TipoNotifica Tipo { get; set; }
        public DateTime Data { get; set; }
    }
}
