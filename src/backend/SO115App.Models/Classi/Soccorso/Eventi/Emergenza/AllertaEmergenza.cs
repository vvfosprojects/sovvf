using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class AllertaEmergenza : Evento
    {
        public AllertaEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string descrizioneEmergenza,
                         string tipologia) : base(istante, codiceFonte, codice, "AllertaEmergenza")
        {
            Motivazione = descrizioneEmergenza;
            DescrizioneEmergenza = tipologia;
        }

        public string Motivazione;
        public string DescrizioneEmergenza;
    }
}
