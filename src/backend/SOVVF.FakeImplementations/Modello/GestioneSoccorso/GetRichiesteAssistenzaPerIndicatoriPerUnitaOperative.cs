using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Soccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso
{
    /// <summary>
    ///   Implementazione fake del servizio che restituisce l'elenco delle richieste di Assistenza
    ///   utilizzate per il calcolo degli indicatori per le Unità Operative indicate
    /// </summary>
    internal class GetRichiesteAssistenzaPerIndicatoriPerUnitaOperative : IGetRichiesteAssistenzaPerIndicatoriPerUnitaOperative
    {
        public IEnumerable<RichiestaAssistenza> Get(IEnumerable<string> codice)
        {
            throw new NotImplementedException();
        }
    }
}
