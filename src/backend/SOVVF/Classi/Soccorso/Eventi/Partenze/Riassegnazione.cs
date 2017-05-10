using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    public class Riassegnazione : Rilascio
    {
        /// <summary>
        ///   E' l'identificativo della Richiesta di Assistenza a cui viene riassegnata la Partenza
        /// </summary>
        public string CodiceRichiesta { get; set; }
    }
}
