using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Scatena la selezione di una squadra per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa squadra dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneSquadra
    {
        /// <summary>
        ///   Seleziona la squadra.
        /// </summary>
        /// <param name="ticket">Ticket della squadra selezionata.</param>
        public void Seleziona(string ticket)
        {
        }
    }
}
