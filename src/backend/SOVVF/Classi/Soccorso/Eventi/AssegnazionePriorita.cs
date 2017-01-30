using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   E' l'evento di una nuova assegnazione della priorità per una richiesta.
    /// </summary>
    /// <remarks>
    ///   Per una stessa richiesta di assistenza si possono verificare molteplici eventi di
    ///   assegnazione della priorità, il che indica una variazione nel tempo della priorità
    ///   associata alla richiesta. Tali variazioni potrebbero anche avvenire a cura di procedure automatizzate.
    /// </remarks>
    public class AssegnazionePriorita : Evento
    {
        /// <summary>
        ///   E' la priorità che l'operatore assegna alla richiesta presa in carico
        /// </summary>
        /// <remarks>
        ///   L'ultimo evento di questa classe indica qual è la priorità dell'istanza di RichiestaAssistenza
        /// </remarks>
        public RichiestaAssistenza.Priorita Priorita { get; set; }
    }
}
