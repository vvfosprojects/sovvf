using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   In viaggio verso il luogo del sinistro.
    /// </summary>
    public class InViaggio : IStatoMezzo
    {
        public bool Disponibile
        {
            get
            {
                return false;
            }
        }
    }
}
