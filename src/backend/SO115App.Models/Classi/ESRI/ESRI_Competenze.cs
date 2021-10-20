using Newtonsoft.Json;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_Competenze
    {
        [JsonProperty(PropertyName = "paramName")]
        public string paramName { get; set; }

        [JsonProperty(PropertyName = "value")]
        public string value { get; set; }
    }
}
