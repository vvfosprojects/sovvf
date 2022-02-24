//-----------------------------------------------------------------------
// <copyright file="GetPosizioneByCodiceMezzo.cs" company="CNVVF">
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
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GeoFleet
{
    /// <summary>
    ///   Servizio che recupera la posizione di un mezzo da Geofleet.
    /// </summary>
    public class GetPosizioneFlotta : IGetPosizioneFlotta
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpRequestManager<MessaggioPosizione> _client2;

        public GetPosizioneFlotta(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IHttpRequestManager<MessaggioPosizione> client2)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _client2 = client2;
        }

        /// <summary>
        ///   Restituisce la posizione del mezzo
        /// </summary>
        /// <param name="Secondi">Sono i secondi di delay della posizione del mezzo</param>
        /// <returns>Il messaggio posizione da Geofleet</returns>
        public async Task<List<MessaggioPosizione>> Get(int Secondi)
        {
            var lstPosizioneFlotta = new List<MessaggioPosizione>();

            var nomeCache = "lstPosizioneFlotta";
            if (!_memoryCache.TryGetValue(nomeCache, out lstPosizioneFlotta))
            {
                var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GeofleetApi").Value}posizioneFlotta");
                response.EnsureSuccessStatusCode();

                using HttpContent content = response.Content;
                string data = await content.ReadAsStringAsync();

                lstPosizioneFlotta = JsonConvert.DeserializeObject<List<MessaggioPosizione>>(data);

                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                _memoryCache.Set(nomeCache, lstPosizioneFlotta, cacheEntryOptions);
            }

            return lstPosizioneFlotta;
        }

        public async Task<List<MessaggioPosizione>> GetByCodiceMezzi(List<string> codiciMezzi)
        {
            try
            {
                var lstPosizioni = new ConcurrentBag<MessaggioPosizione>();

                string baseUrl = $"{_configuration.GetSection("UrlExternalApi").GetSection("GeofleetApi").Value}posizioneByCodiceMezzo/";

                Parallel.ForEach(codiciMezzi.Distinct(), codice =>
                {
                    try
                    {
                        var uri = new Uri(baseUrl + codice + "/");

                        var result = _client2.GetAsync(uri).Result;

                        if (result != null && result != default)
                            lstPosizioni.Add(result);
                    }
                    catch (Exception e) { }
                });

                return lstPosizioni.ToList();
            }
            catch (Exception e)
            {
                return null;
            }
        }
    }
}
