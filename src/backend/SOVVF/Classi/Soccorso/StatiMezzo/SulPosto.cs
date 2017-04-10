using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Presente sul luogo del sinistro
    /// </summary>
    public class SulPosto : IStatoMezzo
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
