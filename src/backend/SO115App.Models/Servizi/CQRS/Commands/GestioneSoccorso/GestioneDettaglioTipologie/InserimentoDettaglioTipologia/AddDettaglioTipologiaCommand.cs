using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia
{
    public class AddDettaglioTipologiaCommand
    {
        public string[] CodiceSede { get; set; }
        public string idOperatore { get; set; }
        public TipologiaDettaglio DettaglioTipologia { get; set; }
    }
}
