using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class CreazioneCraCon : Evento
    {
        public CreazioneCraCon(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string tipologiaEmergenza,
                         CraModel cra) : base(istante, codiceFonte, codice, "CreazioneCra")
        {
            TipologiaEmergenza = tipologiaEmergenza;
            Cra = cra;
        }

        public string TipologiaEmergenza;

        public CraModel Cra;
    }
}
