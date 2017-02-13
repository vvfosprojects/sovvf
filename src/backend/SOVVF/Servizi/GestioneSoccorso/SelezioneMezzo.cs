using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Scatena la selezione di un Mezzo per l'assegnazione ad una
    ///   <see cref="ComposizionePartenza" />. La selezione sottrae la risorsa Mezzo dall'uso da
    ///   parte di tutte le altre postazioni concorrenti.
    /// </summary>
    public class SelezioneMezzo
    {
        /// <summary>
        ///   Seleziona un Mezzo.
        /// </summary>
        /// <param name="CodiceMezzo">Codice del Mezzo selezionato</param>
        public void Seleziona(string CodiceMezzo)
        {
        }
    }
}
