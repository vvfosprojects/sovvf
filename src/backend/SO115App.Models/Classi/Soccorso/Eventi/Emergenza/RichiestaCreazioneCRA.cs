using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class RichiestaCreazioneCRAEmergenza : Evento
    {
        public RichiestaCreazioneCRAEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string tipologiaEmergenza,
                         string[] dirigenti,
                         int numDoa) : base(istante, codiceFonte, codice, "RichiestaCreazioneCRA")
        {
            TipologiaEmergenza = tipologiaEmergenza;
            Dirigenti = dirigenti;
            NumDoa = numDoa;
        }

        public string TipologiaEmergenza;

        public string[] Dirigenti;

        public int NumDoa;

        public DateTime istanteRichiesta;

        public bool Gestita;

        public DateTime istanteGestione;
    }
}
