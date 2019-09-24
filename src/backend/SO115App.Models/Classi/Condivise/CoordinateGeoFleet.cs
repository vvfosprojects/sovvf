using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace SO115App.Models.Classi.Condivise
{
    public class CoordinateGeoFleet
    {
        [JsonProperty(PropertyName = "lat")]
        public double Lat { get; set; }

        [JsonProperty(PropertyName = "lon")]
        public double Lon { get; set; }
    }
}
