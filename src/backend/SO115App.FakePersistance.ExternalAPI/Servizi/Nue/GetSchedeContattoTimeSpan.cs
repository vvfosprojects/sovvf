//-----------------------------------------------------------------------
// <copyright file="GetSchedeContattoTimeSpan.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    /// <summary>
    ///   Classe che restituisce da un servizio mock tutte le schede contatto comprese in un dato
    ///   lasso di tempo
    /// </summary>
    public class GetSchedeContattoTimeSpan : IGetSchedeContattoTimeSpan
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetSchedeContattoTimeSpan(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   Metodo che invia la richiesta al servizio mock per la restituzione di tutte le schede
        ///   contatto comprese in un dato lasso di tempo
        /// </summary>
        /// <param name="dataDa">la data di partenza</param>
        /// <param name="dataA">la data di fine</param>
        /// <returns>Una lista di SchedaContatto</returns>
        public List<SchedaContatto> SchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            var response = _client.GetStringAsync(string.Format(_configuration.GetSection("UrlExternalApi").GetSection("NueApi").Value + Costanti.NueGetByTimeSpan + "/dataDa={0}&dataDa={1}", dataDa, dataA));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
