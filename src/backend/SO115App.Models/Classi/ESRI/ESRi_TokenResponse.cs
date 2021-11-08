using Newtonsoft.Json;
using System;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_TokenResponse
    {
        [JsonProperty(PropertyName = "token")]
        public string token { get; set; }
    }
}
