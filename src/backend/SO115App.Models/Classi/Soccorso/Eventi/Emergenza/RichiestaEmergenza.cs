using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class RichiestaEmergenza : Evento
    {
        public RichiestaEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string tipologiaEmergenza,
                         string[] tipologiaModuli) : base(istante, codiceFonte, codice, "RichiestaEmergenza")
        {
            TipologiaEmergenza = tipologiaEmergenza;
            TipologiaModuli = tipologiaModuli;
        }

        public string TipologiaEmergenza;

        public string[] TipologiaModuli;

        public bool Gestita;

        public DateTime istanteGestione;
    }
}
