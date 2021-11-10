using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class PresaInCaricoEmergenza : Evento
    {
        public PresaInCaricoEmergenza(DateTime istante,
                 string codiceFonte,
                 string codice,
                 string codSedePresaInCarico) : base(istante, codiceFonte, codice, "PresaInCaricoEmergenza")
        {
            CodSedePresaInCarico = codSedePresaInCarico;
        }

        public string CodSedePresaInCarico;
    }
}
