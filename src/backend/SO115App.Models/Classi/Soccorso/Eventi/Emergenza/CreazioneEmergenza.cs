using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class CreazioneEmergenza : Evento
    {
        public CreazioneEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         TipologieEmergenza tipologiaEmergenza) : base(istante, codiceFonte, codice, "CreazioneEmergenza")
        {
            TipologiaEmergenza = tipologiaEmergenza;
        }

        public TipologieEmergenza TipologiaEmergenza;
    }
}
