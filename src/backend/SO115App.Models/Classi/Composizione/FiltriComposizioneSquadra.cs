using SO115App.Models.Classi.Condivise;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.Composizione
{
    public class FiltriComposizioneSquadra
    {
        public Paginazione Pagination { get; set; }
        public string[] CodiciDistaccamenti { get; set; }
        public string Ricerca { get; set; }
        public TurnoRelativo? Turno { get; set; }
        public bool DiEmergenza { get; set; }
        public string CodiceChiamata { get; set; }
        public string[] CodiciCompetenze { get; set; }
        public string Stato { get; set; }

        [JsonPropertyName("codDistaccamentoSelezionato")]
        public string DistaccamentoSquadra { get; set; }
    }
}
