using Newtonsoft.Json;

namespace SO115App.WSNue.Classi.ESRI
{
    public class EsriTokenMsg
    {
        [JsonProperty(PropertyName = "token")]
        public string token { get; set; }
    }
}