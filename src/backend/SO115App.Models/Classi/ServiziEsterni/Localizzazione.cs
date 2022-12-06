using GeoCoordinatePortable;
using System.Text.Json.Serialization;

namespace SO115App.Models.Classi.ServiziEsterni
{
    public class Localizzazione
    {
        [JsonPropertyName("lat")]
        public double Lat
        {
            get;set;
        }

        [JsonPropertyName("lon")]
        public double Lon
        {
            get;set;
        }

        /// <summary>
        ///   The distance between the two coordinates, in meters.
        /// </summary>
        /// <param name="loc">The second location</param>
        /// <returns>The distance in meters</returns>
        public double GetDistanceTo(Localizzazione loc)
        {
            var coord1 = new GeoCoordinate(Lat, Lon);
            var coord2 = new GeoCoordinate(loc.Lat, loc.Lon);

            return coord1.GetDistanceTo(coord2) / 1000;
        }
    }
}
