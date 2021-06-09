using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Composizione
{
    public class FiltriComposizioneSquadra
    {
        //public string IdRichiesta { get; set; }

        //public Paginazione MezziPagination { get; set; }
        public Paginazione SquadrePagination { get; set; }

        public string[] CodiceDistaccamento { get; set; }
        //public string[] TipoMezzo { get; set; }
        //public string[] StatoMezzo { get; set; }

        //public string RicercaMezzi { get; set; }
        public string RicercaSquadre { get; set; }

        public FiltroTurnoRelativo? Turno { get; set; }

        public bool SquadreDiEmergenza { get; set; }
        public bool SquadreColonnaMobile { get; set; }

        //public Mezzo Mezzo { get; set; }
        //public List<Squadra> Squadre { get; set; }
    }
}
