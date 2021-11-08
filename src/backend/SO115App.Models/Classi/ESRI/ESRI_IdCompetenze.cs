using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_IdCompetenze
    {
        [JsonProperty(PropertyName = "jobId")]
        public string jobId { get; set; }

        [JsonProperty(PropertyName = "jobStatus")]
        public string jobStatus { get; set; }
    }
}
