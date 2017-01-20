using System;

namespace Modello.Classi.Soccorso
{
    public abstract class Evento
    {
        public DateTime Istante { get; set; }
        public string UsernameResponsabile { get; set; }
    }
}