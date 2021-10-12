using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_RichiestaMessage
    {
        [JsonProperty(PropertyName = "geometry")]
        public geometry geometry { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public attributes attributes { get; set; }
    }

    public class attributes
    {
        // MongDb_Id, codice, stato, descrizione, categoria
        [JsonProperty(PropertyName = "mongodb_id")]
        public string mongodb_id { get; set; }

        [JsonProperty(PropertyName = "codice")]
        public string codice { get; set; }

        [JsonProperty(PropertyName = "stato")]
        public string stato { get; set; }

        [JsonProperty(PropertyName = "descrizione")]
        public string descrizione { get; set; }

        [JsonProperty(PropertyName = "categoria")]
        public string categoria { get; set; }

        [JsonProperty(PropertyName = "objectId")]
        public int objectId { get; set; }
    }

    public class geometry
    {
        [JsonProperty(PropertyName = "x")]
        public double x { get; set; }

        [JsonProperty(PropertyName = "y")]
        public double y { get; set; }
    }
}
