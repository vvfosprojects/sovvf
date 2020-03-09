//-----------------------------------------------------------------------
// <copyright file="GetSchedeContatto.cs" company="CNVVF">
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
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;

namespace SO115App.ExternalAPI.Fake.Servizi.Nue
{
    /// <summary>
    ///   Classe implementa l'interfaccia per il recupero di tutte le schede contatto di quella sede
    /// </summary>
    public class GetSchedeContatto : IGetSchedeContatto
    {
        private readonly GetSchedeMethods _getSchede;

        public GetSchedeContatto(GetSchedeMethods getSchede)
        {
            _getSchede = getSchede;
        }

        /// <summary>
        ///   Metodo che invia una richiesta al servizio mock NUE e che restituisce tutte le schede
        ///   contatto di quella sede
        /// </summary>
        /// <param name="codiceSede">il codice sede</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> ListaSchedeContatto(string codiceSede)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            return _getSchede.GetSchede(codiceSede);//json

            //---------------------------------------------------------------------------------------
        }
    }
}
