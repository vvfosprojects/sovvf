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
        [JsonProperty(PropertyName = "codicerichiesta")]
        public string codicerichiesta { get; set; }

        [JsonProperty(PropertyName = "stato")]
        public string stato { get; set; }

        [JsonProperty(PropertyName = "operatorecodicefiscale")]
        public string operatorecodicefiscale { get; set; }

        [JsonProperty(PropertyName = "istantericezionerichiesta")]
        public string istantericezionerichiesta { get; set; }

        [JsonProperty(PropertyName = "tipologiacodice")]
        public int tipologiacodice { get; set; }

        [JsonProperty(PropertyName = "tipologiadettaglio")]
        public string tipologiadettaglio { get; set; }

        [JsonProperty(PropertyName = "richiedentetelefono")]
        public string richiedentetelefono { get; set; }

        [JsonProperty(PropertyName = "richiedentenominativo")]
        public string richiedentenominativo { get; set; }

        [JsonProperty(PropertyName = "indirizzo")]
        public string indirizzo { get; set; }

        [JsonProperty(PropertyName = "interno")]
        public string interno { get; set; }

        [JsonProperty(PropertyName = "palazzo")]
        public string palazzo { get; set; }

        [JsonProperty(PropertyName = "scala")]
        public string scala { get; set; }

        [JsonProperty(PropertyName = "note")]
        public string note { get; set; }

        [JsonProperty(PropertyName = "piano")]
        public string piano { get; set; }

        [JsonProperty(PropertyName = "rilevantegrave")]
        public int rilevantegrave { get; set; }

        [JsonProperty(PropertyName = "listaenti")]
        public string listaenti { get; set; }

        [JsonProperty(PropertyName = "chiamataurgente")]
        public int chiamataurgente { get; set; }

        [JsonProperty(PropertyName = "esercitazione")]
        public int esercitazione { get; set; }

        [JsonProperty(PropertyName = "listautentipresaincarico")]
        public string listautentipresaincarico { get; set; }

        [JsonProperty(PropertyName = "tipologiacategoria")]
        public string tipologiacategoria { get; set; }

        [JsonProperty(PropertyName = "objectid")]
        public int objectid { get; set; }
    }

    public class geometry
    {
        [JsonProperty(PropertyName = "x")]
        public double x { get; set; }

        [JsonProperty(PropertyName = "y")]
        public double y { get; set; }
    }
}
