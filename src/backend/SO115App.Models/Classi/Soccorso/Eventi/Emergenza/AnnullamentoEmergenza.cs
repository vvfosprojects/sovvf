using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Classi.Emergenza;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class AnnullamentoEmergenza : Evento
    {
        public AnnullamentoEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string motivazione,
                         string tipologia) : base(istante, codiceFonte, codice, "AnnullamentoEmergenza")
        {
            Motivazione = motivazione;
            TipologiaEmergenza = tipologia;
        }

        public string Motivazione;
        public string TipologiaEmergenza;
    }
}
