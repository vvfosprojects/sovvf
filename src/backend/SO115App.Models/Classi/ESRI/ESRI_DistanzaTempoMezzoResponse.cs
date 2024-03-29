﻿using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_DistanzaTempoMezzoResponse
    {
        [JsonPropertyName("value")]
        public string value { get; set; }
        public List<ESRI_MezzoResponse> lstMezzi
        {
            get
            {
                var data = "[" + value.Replace("};{", "},{").Replace("'", "\"") + "]";

                var result = JsonSerializer.Deserialize<List<ESRI_MezzoResponse>>(data);

                return result;
            }
        }
    }

    public class ESRI_MezzoResponse
    {
        public string codice { get; set; }
        public double distanza { get; set; }
        public double tempo { get; set; }
        public int rank { get; set; }
    }

    //"paramName": "Return",
    //"dataType": "GPString",
    //"value": "{'codice': 'O.23232', 'rank': 1, 'tempo': 47.28518798703324, 'distanza': 48.07721329645839};{'codice': 'O.23232', 'rank': 2, 'tempo': 47.98556656796653, 'distanza': 48.789327619525615};{'codice': 'O.23232', 'rank': 3, 'tempo': 124.42984149929491, 'distanza': 126.50659036766929}"
}
