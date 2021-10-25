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
        [JsonProperty(PropertyName = "codiceRichiesta")]
        public string codicerichiesta { get; set; }

        [JsonProperty(PropertyName = "stato")]
        public string stato { get; set; }

        [JsonProperty(PropertyName = "operatoreCodiceFiscale")]
        public string operatorecodicefiscale { get; set; }

        [JsonProperty(PropertyName = "istanteRicezioneRichiesta")]
        public DateTime istantericezionerichiesta { get; set; }

        [JsonProperty(PropertyName = "tipologiaCodice")]
        public int tipologiacodice { get; set; }

        [JsonProperty(PropertyName = "tipologiaDettaglio")]
        public string tipologiadettaglio { get; set; }

        [JsonProperty(PropertyName = "richiedenteTelefono")]
        public string richiedentetelefono { get; set; }

        [JsonProperty(PropertyName = "richiedenteNominativo")]
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

        [JsonProperty(PropertyName = "rilevanteGrave")]
        public int rilevantegrave { get; set; }

        [JsonProperty(PropertyName = "listaEnti")]
        public string listaenti { get; set; }

        [JsonProperty(PropertyName = "chiamataUrgente")]
        public int chiamataurgente { get; set; }

        [JsonProperty(PropertyName = "esercitazione")]
        public int esercitazione { get; set; }

        [JsonProperty(PropertyName = "listaUtentiPresaInCarico")]
        public string listautentipresaincarico { get; set; }

        [JsonProperty(PropertyName = "tipologiaCategoria")]
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

        [JsonProperty(PropertyName = "spatialReference")]
        public SpatialReference spatialReference { get; set; }
    }

    public class SpatialReference
    {
        public int wkid { get; set; } = 4326;
    }
}
