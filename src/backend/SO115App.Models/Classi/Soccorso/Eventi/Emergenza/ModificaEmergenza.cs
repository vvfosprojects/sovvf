using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class ModificaEmergenza : Evento
    {
        public ModificaEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string tipologiaEmergenza) : base(istante, codiceFonte, codice, "ModificaEmergenza")
        {
            TipologiaEmergenza = tipologiaEmergenza;
        }

        public string TipologiaEmergenza;
    }
}
