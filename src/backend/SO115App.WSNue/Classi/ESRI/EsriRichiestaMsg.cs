using Newtonsoft.Json;
using System;

namespace SO115App.WSNue.Classi.ESRI
{
    public class EsriRichiestaMsg
    {
        [JsonProperty(PropertyName = "geometry")]
        public geometry geometry { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public attributes attributes { get; set; }
    }

    public class attributes
    {
        [JsonProperty(PropertyName = "datainserimento")]
        public DateTime datainserimento { get; set; }

        [JsonProperty(PropertyName = "nominativorichiedente")]
        public string nominativorichiedente { get; set; }

        [JsonProperty(PropertyName = "telefonorichiedente")]
        public string telefonorichiedente { get; set; }

        [JsonProperty(PropertyName = "indirizzo")]
        public string indirizzo { get; set; }

        [JsonProperty(PropertyName = "classificazioneEvento")]
        public string classificazioneEvento { get; set; }

        [JsonProperty(PropertyName = "categoria")]
        public string categoria { get; set; }

        [JsonProperty(PropertyName = "enteCompetenza")]
        public string enteCompetenza { get; set; }

        [JsonProperty(PropertyName = "dettaglio")]
        public string dettaglio { get; set; }

        [JsonProperty(PropertyName = "priorita")]
        public int priorita { get; set; }

        [JsonProperty(PropertyName = "classificazione")]
        public string classificazione { get; set; }

        [JsonProperty(PropertyName = "gestita")]
        public int gestita { get; set; }

        [JsonProperty(PropertyName = "collegata")]
        public int collegata { get; set; }
    }

    public class geometry
    {
        [JsonProperty(PropertyName = "x")]
        public double x { get; set; }

        [JsonProperty(PropertyName = "y")]
        public double y { get; set; }
    }
}