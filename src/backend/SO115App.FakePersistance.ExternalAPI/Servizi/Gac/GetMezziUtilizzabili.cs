//-----------------------------------------------------------------------
// <copyright file="GetMezziUtilizzabili.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.ExternalAPI.Fake.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    /// <summary>
    ///   Servizio che recupera da GAC fake una lista di mezzi in servizio.
    /// </summary>
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili
    {
        private readonly MapMezzoDTOsuMezzo _mapper;
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="mapper">injection del mapper Mezzo-MezzoDTO</param>
        public GetMezziUtilizzabili(MapMezzoDTOsuMezzo mapper, HttpClient client, IConfiguration configuration)
        {
            _mapper = mapper;
            _client = client;
            _configuration = configuration;
        }

        /// <summary>
        ///   Restituisce la lista dei mezzi fake
        /// </summary>
        /// <param name="sedi">una lista di codici sede</param>
        /// <param name="genereMezzo">il genere del mezzo (opzionale)</param>
        /// <param name="codiceMezzo">la sigla del mezzo (opzionale)</param>
        /// <returns>una lista mezzi</returns>
        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var listaSedi = string.Join("&codiciSedi=", sedi.ToArray());
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziUtilizzabili}?codiciSedi={listaSedi}&genereMezzo={genereMezzo}&codiceMezzo={codiceMezzo}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var listaMezziDTO = await content.ReadAsAsync<List<MezzoDTO>>().ConfigureAwait(false);

            return _mapper.MappaMezzoDTOsuMezzo(listaMezziDTO);
        }
    }
}
