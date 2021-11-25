using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.ELogBook
{
    public class LogBook : Evento
    {
        public LogBook(RichiestaAssistenza richiesta,
                         DateTime istante,
                         string codiceFonte,
                         string codice,
                         string note) : base(richiesta, istante, codiceFonte, codice, "LogBook")
        {
            Note = note;
        }

        public string Note;
    }
}
