using SO115App.API.Models.Classi.Soccorso;
using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento
{
    public class AddTrasferimentoCommand
    {
        public string IdOperatore { get; set; }
        public string[] CodiciSede { get; set; }
        public RichiestaAssistenza Richiesta { get; set; }
        public TrasferimentoChiamata TrasferimentoChiamata { get; set; }
    }
}
