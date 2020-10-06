using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Soccorso;

namespace DomainModel.CQRS.Commands.ConfermaPartenze
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
    public class ConfermaPartenzeCommand
    {
        public SO115App.API.Models.Classi.Composizione.ConfermaPartenze ConfermaPartenze { get; set; }

        public RichiestaAssistenza Richiesta { get; set; }
        public RichiestaAssistenza RichiestaDaSganciare { get; set; }
        public Utente Utente { get; set; }
    }
}
