//-----------------------------------------------------------------------
// <copyright file="GetPersonaFisica.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Identity
{
    public class GetPersonaFisica : IGetPersonaFisica
    {
        private readonly HttpClient _client;

        public GetPersonaFisica(HttpClient client)
        {
            _client = client;
        }

        public List<PersonaFisica> Get(List<string> codiceFiscale)
        {
            var content = new KeyValuePair<string, List<string>>("codiciFiscali", codiceFiscale);
            var response = _client.PostAsJsonAsync(Costanti.IdentityManagementUrl, content).ToString();
            return JsonConvert.DeserializeObject<List<PersonaFisica>>(response);
        }
    }
}
