using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using System;

namespace SO115App.Models.Classi.Soccorso.Eventi
{
    public class TrasferimentoChiamata : Evento
    {
        public TrasferimentoChiamata(RichiestaAssistenza richiesta, DateTime istante, string codiceFonte, string tipoEvento) 
            : base(richiesta, istante, codiceFonte, "TrasferimentoChiamata")
        {
            TipoEvento = tipoEvento;
        }
    }
}
