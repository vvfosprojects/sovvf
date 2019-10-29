//-----------------------------------------------------------------------
// <copyright file="SetMovimentazione.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetMovimentazione : ISetMovimentazione
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public SetMovimentazione(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public void Set(string codiceMezzo, string idRichiesta, string statoOperativo, string timeStamp)
        {
            var stringContent = new FormUrlEncodedContent(new[]
                                {
                                    new KeyValuePair<string, string>("codiceMezzo", codiceMezzo),
                                    new KeyValuePair<string, string>("idRichiesta", idRichiesta),
                                    new KeyValuePair<string, string>("statoOperativo", statoOperativo),
                                    new KeyValuePair<string, string>("timeStamp", timeStamp),
                                });
            _client.PutAsync(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacPutMovimentazione, stringContent);
        }
    }
}
