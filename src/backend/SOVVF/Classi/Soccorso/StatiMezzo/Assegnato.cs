using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Assegnato ad una Richiesta
    /// </summary>
    public class Assegnato : IStatoMezzo
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
