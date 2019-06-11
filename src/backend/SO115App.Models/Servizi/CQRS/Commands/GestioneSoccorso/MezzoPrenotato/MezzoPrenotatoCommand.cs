
namespace DomainModel.CQRS.Commands.MezzoPrenotato
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>
    ///   Eventualmente si può filtrare per cercare solo i dati di un singolo Box
    /// </remarks>
    /// 
    public class MezzoPrenotatoCommand
    {
        public SO115App.API.Models.Classi.Composizione.MezzoPrenotato MezzoPrenotato { get; set; }
    }
}