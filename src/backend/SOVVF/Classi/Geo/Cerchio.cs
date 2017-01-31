namespace Modello.Classi.Geo
{
    /// <summary>
    ///   Modella un cerchio sul globo
    /// </summary>
    public class Cerchio : Geolocalizzazione
    {
        /// <summary>
        ///   E' il centro del cerchio
        /// </summary>
        public Punto Centro { get; set; }

        /// <summary>
        ///   E' il raggio del cerchio
        /// </summary>
        public double Raggio { get; set; }
    }
}
