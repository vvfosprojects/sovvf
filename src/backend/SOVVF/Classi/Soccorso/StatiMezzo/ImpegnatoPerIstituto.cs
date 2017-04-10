using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.StatiMezzo
{
    /// <summary>
    ///   Impegnato per motivi di Istituto
    /// </summary>
    public class ImpegnatoPerIstituto : IStatoMezzo
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
