using SO115App.Models.Classi.Condivise;

namespace SO115App.Models.Classi.Composizione
{
    public class FiltriComposizioneSquadra
    {
        public Paginazione Pagination { get; set; }
        public string[]? CodiciDistaccamenti { get; set; }
        public string Ricerca { get; set; }
        public bool DiEmergenza { get; set; }
        public string CodiceChiamata { get; set; }
        public string[] CodiciCompetenze { get; set; }
        public TurnoRelativo? Turno { get; set; }
        public StatoSquadraComposizione? Stato { get; set; }
        public string CodDistaccamentoSelezionato { get; set; }
        public string CodMezzoSelezionato { get; set; }
        public string CodSquadraSelezionata { get; set; }
    }
}
