using Newtonsoft.Json;
using System.Collections.Generic;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_Competenze
    {
        [JsonProperty(PropertyName = "results")]
        public List<Risultati> results { get; set; }
    }

    public class Risultati
    {
        [JsonProperty(PropertyName = "paramName")]
        public string paramName { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string value { get; set; }
    }
}
