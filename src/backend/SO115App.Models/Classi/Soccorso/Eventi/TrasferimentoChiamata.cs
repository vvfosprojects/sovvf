using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class TrasferimentoChiamata : Evento
    {
        public TrasferimentoChiamata(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string DesSedeDa, string DesSedeA, string SedeOperatore, string tipoEvento = "TrasferimentoChiamata")
            : base(richiesta, istante, codiceFonte, tipoEvento, SedeOperatore) 
        {
            Note = $"Trasferita da {DesSedeDa} a {DesSedeA}";
        }

        public string Note { get; set; }
    }
}