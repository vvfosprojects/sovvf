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
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    /// <summary>
    ///   Classe che aggiorna la stato della scheda contatto in letta
    /// </summary>

    public class SetLetta : ISetLetturaSchedaContatto
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public SetLetta(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
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
            var stringContent = new FormUrlEncodedContent(new[]
                    {
                                    new KeyValuePair<string, string>("codiceScheda", codiceScheda),
                                    new KeyValuePair<string, string>("codiceSede", codiceSede),
                                    new KeyValuePair<string, string>("codiceFiscale", codiceFiscale),
                                    new KeyValuePair<string, string>("gestita", letta.ToString()),
                                });

            _client.PostAsJsonAsync(_configuration.GetSection("UrlExternalApi").GetSection("NueApi").Value + Costanti.NueSetLetta, stringContent);
        }
    }
}
