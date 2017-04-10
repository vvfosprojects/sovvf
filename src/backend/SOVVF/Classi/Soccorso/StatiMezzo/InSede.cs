using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Presente presso la sede di servizio
    /// </summary>
    public class InSede : IStatoMezzo
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
