using System.Text.Json.Serialization;

namespace Google_API
{

    /// <summary>
    /// Classe utilizzata per la mappatura del Json di ritorno dalla chiamata all'API Google Distance Matrix
    /// </summary>
    public partial class DistanceMatrix
    {
        [JsonPropertyName("origin_addresses")]
        public string[] OriginAddresses { get; set; }

        [JsonPropertyName("destination_addresses")]
        public string[] DestinationAddresses { get; set; }

        [JsonPropertyName("rows")]
        public Row[] Rows { get; set; }

        [JsonPropertyName("status")]
        public string Status { get; set; }
    }

    public partial class Row
    {
        [JsonPropertyName("elements")]
        public Element[] Elements { get; set; }
    }

    public partial class Element
    {
        [JsonPropertyName("status")]
        public string Status { get; set; }

        [JsonPropertyName("duration")]
        public Distance Duration { get; set; }

        [JsonPropertyName("distance")]
        public Distance Distance { get; set; }
    }

    public partial class Distance
    {
        [JsonPropertyName("value")]
        public long Value { get; set; }

        [JsonPropertyName("text")]
        public string Text { get; set; }
    }
}

