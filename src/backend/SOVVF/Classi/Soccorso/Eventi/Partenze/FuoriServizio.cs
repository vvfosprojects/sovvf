using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    public class FuoriServizio : Rilascio
    {
        /// <summary>
        ///   E' la motivazione che giustifica la transizione di stato verso Fuori Servizio
        /// </summary>
        public string Motivazione { get; set; }
    }
}
