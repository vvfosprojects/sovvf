//-----------------------------------------------------------------------
// <copyright file="SetLetta.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;

namespace SO115App.ExternalAPI.Fake.Nue
{
    /// <summary>
    ///   Classe che aggiorna la stato della scheda contatto in letta
    /// </summary>

    public class SetLetta : ISetLetturaSchedaContatto
    {
        private readonly SetSchedaContatto _setSchedaContatto;

        public SetLetta(SetSchedaContatto setSchedaContatto)
        {
            _setSchedaContatto = setSchedaContatto;
        }

        /// <summary>
        ///   Metodo che invia la richiesta al servizio NUE per aggiornare la stato della scheda
        ///   contatto in letta
        /// </summary>
        /// <param name="codiceScheda">il codice della scheda contatto</param>
        /// <param name="codiceSede">il codice sede dell'operatore</param>
        /// <param name="codiceFiscale">il codice fiscale dell'operatore</param>
        /// <param name="letta">la booleana letta</param>
        public void Letta(string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            //---------------TODO Implementazione con il servizio esterno reale che sostituirà i json

            _setSchedaContatto.SetLetta(codiceSede, codiceScheda, codiceFiscale, letta); //json

            //---------------------------------------------------------------------------------------
        }
    }
}
