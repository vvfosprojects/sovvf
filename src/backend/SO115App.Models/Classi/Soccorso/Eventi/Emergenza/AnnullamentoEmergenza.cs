using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi.Emergenza
{
    public class AnnullamentoEmergenza : Evento
    {
        public AnnullamentoEmergenza(DateTime istante,
                         string codiceFonte,
                         string codice,
                         string motivazione) : base(istante, codiceFonte, codice, "AnnullamentoEmergenza")
        {
            Motivazione = motivazione;
        }

        public string Motivazione;
    }
}
