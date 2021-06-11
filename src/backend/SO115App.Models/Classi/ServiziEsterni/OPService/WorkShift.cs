using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.OPService
{
    public class WorkShift
    {
        [JsonPropertyName("previous")]
        public Squadra[] Precedente { get; set; }

        [JsonPropertyName("next")]
        public Squadra[] Successivo { get; set; }

        [JsonPropertyName("current")]
        public Squadra[] Attuale { get; set; }
    }
}
