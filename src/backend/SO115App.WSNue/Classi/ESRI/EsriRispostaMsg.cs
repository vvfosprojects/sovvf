using Newtonsoft.Json;
using System.Collections.Generic;

namespace SO115App.WSNue.Classi.ESRI
{
    public class EsriRispostaMsg
    {
        [JsonProperty(PropertyName = "addResults")]
        public List<Result> addResults { get; set; }

        [JsonProperty(PropertyName = "error")]
        public Error error { get; set; }
    }

    public class Error
    {
        [JsonProperty(PropertyName = "code")]
        public int code { get; set; }

        [JsonProperty(PropertyName = "message")]
        public string message { get; set; }
    }

    public class Result
    {
        [JsonProperty(PropertyName = "objectId")]
        public int objectId { get; set; }

        [JsonProperty(PropertyName = "globalId")]
        public string globalId { get; set; }

        [JsonProperty(PropertyName = "success")]
        public bool success { get; set; }

        [JsonProperty(PropertyName = "error")]
        public error error { get; set; }
    }

    public class error
    {
        [JsonProperty(PropertyName = "code")]
        public int code { get; set; }

        [JsonProperty(PropertyName = "description")]
        public string description { get; set; }
    }
}