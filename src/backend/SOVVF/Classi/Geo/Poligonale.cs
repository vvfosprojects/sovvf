using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Geo
{
    /// <summary>
    /// Modella una poligonale sul globo
    /// </summary>
    public class Poligonale : Geolocalizzazione
    {
        public IList<Punto> Vertici { get; set; }
    }
}
