using System.Collections.Generic;

namespace Modello.Classi.Geo
{
    /// <summary>
    ///   Modella una poligonale sul globo
    /// </summary>
    public class Poligonale : Geolocalizzazione
    {
        /// <summary>
        ///   Rappresenta la lista dei vertigi della poligonale
        /// </summary>
        /// <remarks>
        ///   Non è richiesto che il primo e l'ultimo vertice corrispondano, chiudendo così la poligonale.
        /// </remarks>
        public IList<Punto> Vertici { get; set; }
    }
}
