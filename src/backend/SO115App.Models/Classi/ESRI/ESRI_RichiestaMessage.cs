using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_RichiestaMessage
    {
        [JsonProperty(PropertyName = "geometry")]
        public geometry Geometry { get; set; }

        [JsonProperty(PropertyName = "attributes")]
        public attributes Attributes { get; set; }
    }

    public class attributes
    {
        // MongDb_Id, codice, stato, descrizione, categoria
        [JsonProperty(PropertyName = "mongodb_id")]
        public string Mongodb_id { get; set; }

        [JsonProperty(PropertyName = "codice")]
        public string Codice { get; set; }

        [JsonProperty(PropertyName = "stato")]
        public string Stato { get; set; }

        [JsonProperty(PropertyName = "descrizione")]
        public string Descrizione { get; set; }

        [JsonProperty(PropertyName = "categoria")]
        public string Categoria { get; set; }
    }

    public class geometry
    {
        [JsonProperty(PropertyName = "x")]
        public string X { get; set; }

        [JsonProperty(PropertyName = "y")]
        public string Y { get; set; }
    }
}
