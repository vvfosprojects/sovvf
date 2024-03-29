﻿using Persistence.MongoDB;
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;

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
        public List<SchedaContatto> Get(string text, bool? gestita, string codiceFiscale, double? rangeOre, string codSede, string classificazione, string codiceSede)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            var ListaSchede = _getSchedeMethods.GetFiltered(text, gestita, codiceFiscale, rangeOre, classificazione, codiceSede);
            return ListaSchede;

            //---------------------------------------------------------------------------------------
        }
    }
}
