using SO115App.API.Models.Classi.Geo;
using SO115App.Models.Classi.NUE;
using System;
using System.Collections.Generic;
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce l'elenco delle schede contatto corrispondenti ai
    ///   criteri di ricerca indicati
    /// </summary>
    public interface IGetSchedeContattoByCodiciFiscali
    {
        /// <summary>
        ///   Restituisce l'elenco delle schede contatto corrispondenti ai criteri di ricerca indicati
        /// </summary>
        /// <returns>Lista schede contatto</returns>
        List<SchedaContatto> SchedeContattoFromCodiciFiscali(List<string> codiciFiscali);
    }
}
