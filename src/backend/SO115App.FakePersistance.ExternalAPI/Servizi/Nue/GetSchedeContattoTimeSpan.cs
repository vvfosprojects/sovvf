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
using Newtonsoft.Json;
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Nue
{
    public class GetSchedeContattoTimeSpan : IGetSchedeContattoTimeSpan
    {
        private readonly HttpClient _client;

        public GetSchedeContattoTimeSpan(HttpClient client)
        {
            _client = client;
        }

        public List<SchedaContatto> SchedeContattoTimeSpan(DateTime dataDa, DateTime dataA)
        {
            var response = _client.GetStringAsync(string.Format(Costanti.NueUrl + "/GetByTimeSpan/dataDa={0}&dataDa={1}", dataDa, dataA));
            return JsonConvert.DeserializeObject<List<SchedaContatto>>(response.ToString());
        }
    }
}
