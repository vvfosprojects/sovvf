using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_ResponseMessage
    {
        [JsonProperty(PropertyName = "addResults")]
        public List<Result> addResults { get; set; }
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
        public string code { get; set; }

        [JsonProperty(PropertyName = "description")]
        public string description { get; set; }
    }
}
