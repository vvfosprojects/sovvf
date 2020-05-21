using MongoDB.Driver;
using Persistence.MongoDB;
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue
{
    /// <summary>
    ///   Classe che restituisce tutte le schede contatto in accordo con i filtri immessi
    /// </summary>
    public class GetSchedeFiltrate : IGetSchedeFiltrate
    {
        private readonly GetSchedeMethods _getSchedeMethods;
        private readonly DbContext _context;

        public GetSchedeFiltrate(GetSchedeMethods getSchedeMethods, DbContext context)
        {
            _getSchedeMethods = getSchedeMethods;
            this._context = context;
        }

        /// <summary>
        ///   Metodo che invia la richiesta per il reperimento di tutte le schede filtrate
        /// </summary>
        /// <param name="text">stringa text</param>
        /// <param name="gestita">booleana gestita</param>
        /// <param name="letta">booleana letta</param>
        /// <param name="codiceFiscale">stringa codicefiscale</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> Get(string text, bool? gestita, string codiceFiscale, double? rangeOre, string codSede)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            var ListaSchede = _getSchedeMethods.GetFiltered(text, gestita, codiceFiscale, rangeOre);
            //var ListaSchedeRaggruppate = _context.SchedeContattoCollection.Find(Builders<SchedaContatto>.Filter.Empty).ToList();

            //List<SchedaContatto> ListaSchedefiltrata = new List<SchedaContatto>();

            //foreach (SchedaContatto scheda in ListaSchede)
            //{
            //    if (!ListaSchedeRaggruppate.Exists(x => x.CodiceScheda.Equals(scheda.CodiceScheda)))
            //    {
            //        ListaSchedefiltrata.Add(scheda);
            //    }
            //    else
            //    {
            //        var schedaRaggruppata = ListaSchedeRaggruppate.Find(x => x.CodiceScheda.Equals(scheda.CodiceScheda));
            //        if (!schedaRaggruppata.Collegata)
            //            ListaSchedefiltrata.Add(schedaRaggruppata);
            //    }
            //}

            return ListaSchede;

            //---------------------------------------------------------------------------------------
        }
    }
}
