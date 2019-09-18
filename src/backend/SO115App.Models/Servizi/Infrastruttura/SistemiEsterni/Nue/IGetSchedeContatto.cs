using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Soccorso;
using System;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce l'elenco delle schede contatto corrispondenti ai
    ///   criteri di ricerca indicati
    /// </summary>
    public interface IGetSchedeContatto
    {
        /// <summary>
        ///   Restituisce l'elenco delle schede contatto corrispondenti ai criteri di ricerca indicati
        /// </summary>
        /// <returns>Lista schede contatto</returns>
        List<SchedaContatto> GetSchedeContatto(DateTime DataDa, DateTime DataA, bool Gestite, bool Lette, List<string> ListCodiciFiscaliOperatori, List<string> TipoScheda, string TestoLibero, string CodiceSede, AreaMappa AreaSpaziale);
    }
}
