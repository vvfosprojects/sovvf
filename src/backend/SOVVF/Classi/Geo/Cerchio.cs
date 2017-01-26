namespace Modello.Classi.Geo
{
    /// <summary>
    ///   Modella un cerchio sul globo
    /// </summary>
    public class Cerchio : Geolocalizzazione
    {
        public Punto Centro { get; set; }
        public double Raggio { get; set; }
    }
}
