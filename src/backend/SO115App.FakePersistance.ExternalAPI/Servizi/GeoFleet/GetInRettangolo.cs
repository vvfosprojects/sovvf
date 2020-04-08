//-----------------------------------------------------------------------
// <copyright file="GetInRettangolo.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    /// <summary>
    ///   Servizio che recupera la posizione di tutti i mezzi in un dato rettangolo di coordinate.
    /// </summary>
    public class GetInRettangolo : IGetInRettangolo
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetInRettangolo(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   Restituisce le posizioni di tutti i mezzi in dato rettangolo
        /// </summary>
        /// <param name="lat1">latitudine del vertice topright</param>
        /// <param name="lon1">longitudine del vertice topright</param>
        /// <param name="lat2">latitudine del vertice bottomleft</param>
        /// <param name="lon2">longitudine del vertice bottomleft</param>
        /// <param name="attSec">
        ///   valore di default secondo il quale viene restituita la posizione dell'intera flotta
        /// </param>
        /// <returns>Le posizioni dei mezzi da Geofleet</returns>
        public List<MessaggioPosizione> Get(double lat1, double lon1, double lat2, double lon2, int attSec)
        {
            var response = _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GeofleetApi").Value}{Costanti.GeoFleetGetInRettangolo}?lat1={lat1}&lon1={lon1}&lat2={lat2}&lon2={lon2}&attsec={attSec}").ToString();

            return JsonConvert.DeserializeObject<List<MessaggioPosizione>>(response);
        }
    }
}
