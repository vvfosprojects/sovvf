using Newtonsoft.Json;
using System;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_SchedaContattoMsg
    {
        [JsonProperty(PropertyName = "geometry")]
        public geometry geometry { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public SchedaContattoAttributes attributes { get; set; }
    }

    public class SchedaContattoAttributes
    {
        public int objectid { get; set; }

        public DateTime dataInserimento { get; set; }

        public string NominativoRichiedente { get; set; }

        public string TelefonoRichiedente { get; set; }

        public string Indirizzo { get; set; }

        public string classificazioneEvento { get; set; }

        public string categoria { get; set; }

        public string enteCompetenza { get; set; }

        public string dettaglio { get; set; }

        public int priorita { get; set; }

        public string classificazione { get; set; }

        public bool gestita { get; set; }

        public bool collegata { get; set; }
    }
}
