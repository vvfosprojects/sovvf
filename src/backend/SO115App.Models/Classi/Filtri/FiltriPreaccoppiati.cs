using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Filtri
{
    public class FiltriPreaccoppiati
    {
        public string[] CodiceDistaccamento { get; set; }
        public string IdRichiesta { get; set; }
        public Paginazione Pagination { get; set; }
        public string[] StatoMezzo { get; set; }
        public string[] TipoMezzo { get; set; }
    }
}
