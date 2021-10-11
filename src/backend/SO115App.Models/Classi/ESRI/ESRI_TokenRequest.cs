using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_TokenRequest
    {
        [JsonProperty(PropertyName = "f")]
        public string F { get; set; }

        [JsonProperty(PropertyName = "user")]
        public string User { get; set; }

        [JsonProperty(PropertyName = "password")]
        public string Password { get; set; }

        [JsonProperty(PropertyName = "referer")]
        public string Referer { get; set; }
    }
}
