using SO115App.API.Models.Classi.Condivise;
using System;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni
{
    public class MessaggioPosizione
    {
        [JsonPropertyName("codiceMezzo")]
        public string CodiceMezzo { get; set; }

        [JsonPropertyName("localizzazione")]
        public Localizzazione Localizzazione { get; set; }

        [JsonPropertyName("istanteAcquisizione")]
        public DateTime IstanteAcquisizione { get; set; }

        public Coordinate ToCoordinate()
        {
            if (Localizzazione != null && Localizzazione.Lon != null && Localizzazione.Lat != null)
                return new Coordinate(Localizzazione.Lat, Localizzazione.Lon);
            else
                return null;
        }
    }
}
