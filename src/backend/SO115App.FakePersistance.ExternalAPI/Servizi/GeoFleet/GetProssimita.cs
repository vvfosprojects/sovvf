//-----------------------------------------------------------------------
// <copyright file="GetProssimita.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    public class GetProssimita : IGetProssimita
    {
        private HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetProssimita(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<ProssimitaMezzo> Get(float lat, float lon, float maxRadius, List<string> classiMezzo, int attSec)
        {
            var response = _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GeofleetApi").Value}{Costanti.GeoFleetGetProssimita}?lat={lat}&lon={lon}&distanzaMaxMt={maxRadius}&classiMezzo={classiMezzo}&attsec{attSec}").ToString();
            return JsonConvert.DeserializeObject<List<ProssimitaMezzo>>(response);
        }
    }
}
