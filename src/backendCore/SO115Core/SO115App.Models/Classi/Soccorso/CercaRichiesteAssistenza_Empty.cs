using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Classi.Soccorso
{
    public class CercaRichiesteAssistenza_Empty : ICercaRichiesteAssistenza
    {
        /// <summary>
        ///   Restituisce un set vuoto di sintesi richiesta
        /// </summary>
        /// <param name="filtro">Not used</param>
        /// <returns>Il set vuoto di richieste</returns>
        public IEnumerable<RichiestaAssistenza> Get(FiltroRicercaRichiesteAssistenza filtro)
        {
            return Enumerable.Empty<RichiestaAssistenza>();
        }
    }
}