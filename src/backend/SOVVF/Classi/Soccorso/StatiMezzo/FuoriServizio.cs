using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Fuori Servizio
    /// </summary>
    public class Fuoriservizio : IStatoMezzo
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
