using System.Collections.Generic;

namespace Modello.Classi.Geo
{
    /// <summary>
    ///   Modella una poligonale sul globo
    /// </summary>
    public class Poligonale : Geolocalizzazione
    {
        public IList<Punto> Vertici { get; set; }
    }
}
