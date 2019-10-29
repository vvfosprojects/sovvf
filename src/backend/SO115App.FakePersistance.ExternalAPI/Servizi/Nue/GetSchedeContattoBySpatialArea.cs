//-----------------------------------------------------------------------
// <copyright file="GetSchedeContattoBySpatialArea.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoBySpatialArea : IGetSchedeContattoBySpatialArea
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetSchedeContattoBySpatialArea(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<SchedaContatto> SchedeContattoBySpatialArea(double lat1, double lon1, double lat2, double lon2)
        {
            var response = _client.GetStringAsync(string.Format(_configuration.GetSection("UrlExternalApi").GetSection("NueApi").Value + Costanti.NueGetByArea + "/lat1={0},lon1={1},lat2={2},lon2={3},", lat1, lon1, lat2, lon2));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
