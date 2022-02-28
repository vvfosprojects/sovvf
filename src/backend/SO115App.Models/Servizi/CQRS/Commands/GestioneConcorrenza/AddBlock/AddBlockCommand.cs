using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Concorrenza;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock
{
    /// <summary>
    ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
    /// </summary>
    /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
    public class AddBlockCommand
    {
        public Concorrenza concorrenza { get; set; }
        public Utente utente { get; set; }
    }
}
