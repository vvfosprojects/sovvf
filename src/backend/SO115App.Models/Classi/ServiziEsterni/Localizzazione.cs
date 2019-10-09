using GeoCoordinatePortable;

namespace SO115App.Models.Classi.ServiziEsterni
{
    public class Localizzazione
    {
        private readonly double[] coordinates = new double[2];

        public double Lat
        {
            get { return coordinates[1]; }
            set { coordinates[1] = value; }
        }

        public double Lon
        {
            get { return coordinates[0]; }
            set { coordinates[0] = value; }
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

            return coord1.GetDistanceTo(coord2);
        }
    }
}
