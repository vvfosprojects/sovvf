using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class InserimentoEnteIntervenuto : Evento
    {
        public InserimentoEnteIntervenuto(RichiestaAssistenza richiesta,
            DateTime istante,
            string codiceFonte,
            string DescrizioneEnte,
            string SedeOperatore,
            string tipoEvento = "InserimentoEnteIntervenuto")
            : base(richiesta, istante, codiceFonte, tipoEvento, SedeOperatore)
        {
            Note = $"E' stato richiesto l'intervento dell'ente {DescrizioneEnte}";
        }

        public string Note { get; set; }
    }
}
