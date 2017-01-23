using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Geo
{
    /// <summary>
    /// Modella un punto sul globo
    /// </summary>
    public class Punto : Geolocalizzazione
    {
        /// <summary>
        /// E' la latitudine del punto, che su una mappatura planare corrisponde alla Y
        /// </summary>
        public double Latitudine { get; set; }

        /// <summary>
        /// E' la longitudine del punto, che su una mappatura planare corrisponde alla X
        /// </summary>
        public double Longitudine { get; set; }
    }
}
