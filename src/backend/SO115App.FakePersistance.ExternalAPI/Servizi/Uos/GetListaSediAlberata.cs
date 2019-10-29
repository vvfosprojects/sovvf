//-----------------------------------------------------------------------
// <copyright file="GetListaSediAlberata.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.Uos;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Uos
{
    public class GetListaSediAlberata
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaSediAlberata(HttpClient client, IConfiguration configuration)
        {
            this._client = client;
            this._configuration = configuration;
        }

        public List<Sede> ListaSediAlberata()
        {
            try
            {
                List<UosDTO> ListaISP = new List<UosDTO>();
                List<UosDTO> ListaCMD = new List<UosDTO>();
                List<UosDTO> ListaDST = new List<UosDTO>();
                List<AssociativaDTO> ListaAssociazioni = new List<AssociativaDTO>();
                List<SedeDTO> ListaSedi = new List<SedeDTO>();

                var ExternalUrlString = _configuration.GetSection("UrlExternalApi").GetSection("UOSApi").Value;
                var responseISP = _client.GetStringAsync(ExternalUrlString + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "ISP", "100"));
                var responseCMD = _client.GetStringAsync(ExternalUrlString + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "CMD", "100"));
                var responseDST = _client.GetStringAsync(ExternalUrlString + Costanti.UosUOUrl + String.Format("?codTipologia={0}&pageSize={1}", "DST", "100"));
                var responseAss = _client.GetStringAsync(ExternalUrlString + Costanti.UosAssUrl);
                var responseSedi = _client.GetStringAsync(ExternalUrlString + Costanti.UosSediUrl);

                var ListIPS = JsonConvert.DeserializeObject<UosDTO>(responseISP.ToString());
                var ListCMD = JsonConvert.DeserializeObject<UosDTO>(responseCMD.ToString());
                var ListDST = JsonConvert.DeserializeObject<UosDTO>(responseDST.ToString());
                var ListAss = JsonConvert.DeserializeObject<AssociativaDTO>(responseAss.ToString());
                var ListSedi = JsonConvert.DeserializeObject<SedeDTO>(responseSedi.ToString());

                return null;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
