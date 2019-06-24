
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;

namespace DomainModel.CQRS.Commands.ConfermaPartenze
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>
    ///   Eventualmente si può filtrare per cercare solo i dati di un singolo Box
    /// </remarks>
    /// 
    public class ConfermaPartenzeCommand
    {
        public SO115App.API.Models.Classi.Composizione.ConfermaPartenze ConfermaPartenze { get; set; }

        public string codiceSede { get; set; }
    }
}