using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi.Eccezioni
{
    public class ComposizionePartenzaException : ApplicationException
    {
        public ComposizionePartenzaException(string message) : base(message)
        {
        }

        public ComposizionePartenzaException(string message, Exception inner) : base(message, inner)
        {
        }
    }
}
