using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_UpDateResposeMessage
    {
        [JsonProperty(PropertyName = "updateResults")]
        public List<UpDateResult> updateResults { get; set; }
    }

    public class UpDateResult
    {
        [JsonProperty(PropertyName = "objectId")]
        public int objectId { get; set; }

        [JsonProperty(PropertyName = "success")]
        public bool success { get; set; }
    }
}
