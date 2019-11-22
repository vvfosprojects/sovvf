//-----------------------------------------------------------------------
// <copyright file="SetGestita.cs" company="CNVVF">
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
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Nue.Mock;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    /// <summary>
    ///   Classe che aggiorna la stato della scheda contatto in gestita e di conseguenza in letta
    /// </summary>

    public class SetGestita : ISetStatoGestioneSchedaContatto
    {
        private readonly SetSchedaContatto _setSchedaContatto;

        public SetGestita(SetSchedaContatto setSchedaContatto)
        {
            _setSchedaContatto = setSchedaContatto;
        }

        /// <summary>
        ///   Metodo che invia una richiesta POST sul servizio Nue per aggiornare la stato della
        ///   scheda contatto in gestita e di conseguenza in letta
        /// </summary>
        /// <param name="codiceScheda">il codice della scheda contatto</param>
        /// <param name="codiceSede">il codice sede dell'operatore</param>
        /// <param name="codiceFiscale">il codice fiscale dell'operatore</param>
        /// <param name="gestita">la booleana gestita</param>
        public void Gestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            _setSchedaContatto.SetGestita(codiceScheda, codiceSede, codiceFiscale, gestita);//json

            //---------------------------------------------------------------------------------------
        }
    }
}
