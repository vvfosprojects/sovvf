using Newtonsoft.Json;
using System;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_SchedaContattoMsg
    {
        [JsonProperty(PropertyName = "geometry")]
        public geometrySC geometry { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public SchedaContattoAttributes attributes { get; set; }
    }

    public class SchedaContattoAttributes
    {
        [JsonProperty(PropertyName = "objectid")]
        public int objectid { get; set; }

        public double dataInserimento { get; set; }

        public string NominativoRichiedente { get; set; }

        public string TelefonoRichiedente { get; set; }

        public string Indirizzo { get; set; }

        public string classificazioneEvento { get; set; }

        public string categoria { get; set; }

        public string enteCompetenza { get; set; }

        public string dettaglio { get; set; }

        public int priorita { get; set; }

        public string classificazione { get; set; }

        public int gestita { get; set; }

        public int collegata { get; set; }
    }

    public class geometrySC
    {
        [JsonProperty(PropertyName = "x")]
        public double x { get; set; }

        [JsonProperty(PropertyName = "y")]
        public double y { get; set; }

        [JsonProperty(PropertyName = "spatialReference")]
        public SpatialReference spatialReference { get; set; }
    }

    public class SpatialReference
    {
        public int wkid { get; set; } = 4326;
    }
}
