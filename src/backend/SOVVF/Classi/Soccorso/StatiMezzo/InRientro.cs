using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   In viaggio verso la sede di servizio
    /// </summary>
    public class InRientro : IStatoMezzo
    {
        public bool Disponibile
        {
            get
            {
                return true;
            }
        }
    }
}
