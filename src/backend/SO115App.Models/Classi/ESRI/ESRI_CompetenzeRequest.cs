using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ESRI
{
    public class ESRI_CompetenzeRequest
    {
        [JsonProperty(PropertyName = "x")]
        public double x { get; set; }

        [JsonProperty(PropertyName = "y")]
        public double y { get; set; }
    }
}
