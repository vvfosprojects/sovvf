using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Mezzi.StatiMezzo;

namespace Modello.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Indica che è un evento legato ad una partenza
    /// </summary>
    public interface IPartenza : IEvento
    {
        string[] CodiciMezzo { get; }

        IStatoMezzo GetStatoMezzo();
    }
}
