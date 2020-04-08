using Newtonsoft.Json;

namespace Google_API
{

    /// <summary>
    /// Classe utilizzata per la mappatura del Json di ritorno dalla chiamata all'API Google Distance Matrix
    /// </summary>
    public partial class DistanceMatrix
    {
        [JsonProperty("originAddresses")]
        public string[] OriginAddresses { get; set; }

        [JsonProperty("destinationAddresses")]
        public string[] DestinationAddresses { get; set; }

        [JsonProperty("rows")]
        public Row[] Rows { get; set; }
    }

    public partial class Row
    {
        [JsonProperty("elements")]
        public Element[] Elements { get; set; }
    }

    public partial class Element
    {
        [JsonProperty("status")]
        public string Status { get; set; }

        [JsonProperty("duration")]
        public Distance Duration { get; set; }

        [JsonProperty("distance")]
        public Distance Distance { get; set; }
    }

    public partial class Distance
    {
        [JsonProperty("value")]
        public long Value { get; set; }

        [JsonProperty("text")]
        public string Text { get; set; }
    }
}

