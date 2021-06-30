using System;
using System.Collections.Generic;
using System.Text;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni.OPService
{
    public class actionDTO : Squadra
    {
        [JsonPropertyName("actionType")]
        public string actionType { get; set; }

        [JsonPropertyName("createdAt")]
        public DateTime createdAt { get; set; }

        [JsonPropertyName("id_chiamata")]
        public string id_chiamata { get; set; }

        [JsonPropertyName("id_mezzi")]
        public string[] id_mezzi { get; set; }

        [JsonPropertyName("id_sede")]
        public string id_sede { get; set; }

        [JsonPropertyName("id_utente")]
        public string id_utente { get; set; }
    }
}
