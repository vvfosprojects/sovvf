//-----------------------------------------------------------------------
// <copyright file="GetSchedaContattoAttuale.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    /// <summary>
    ///   Classe che implementa l'interfaccia per il recupero della scheda contatto attuale
    /// </summary>
    public class GetSchedaContattoAttuale : IGetSchedaContattoAttuale
    {
        private readonly GetSchedeMethods _getSchedeMethods;

        public GetSchedaContattoAttuale(GetSchedeMethods getSchedeMethods)
        {
            _getSchedeMethods = getSchedeMethods;
        }

        /// <summary>
        ///   Metodo che invia una richiesta al mock di NUE per il recupero della scheda contatto attuale.
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <param name="codiceOperatore">il codice dell'operatore</param>
        /// <returns>SchedaContatto</returns>
        public SchedaContatto SchedaContattoAttuale(string codiceSede, string codiceOperatore)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            return _getSchedeMethods.GetSchedaContattoAttuale(codiceSede, codiceOperatore);

            //---------------------------------------------------------------------------------------
        }
    }
}
