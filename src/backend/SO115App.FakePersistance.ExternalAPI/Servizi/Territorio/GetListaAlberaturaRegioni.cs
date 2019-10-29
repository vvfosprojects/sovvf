//-----------------------------------------------------------------------
// <copyright file="GetListaAlberaturaRegioni.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Territorio
{
    public class GetListaAlberaturaRegioni : IGetAlberaturaISTAT
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaAlberaturaRegioni(HttpClient client, IConfiguration configuration)
        {
            this._client = client;
            this._configuration = configuration;
        }

        public List<Models.Classi.Condivise.Regione> ListaAlberaturaRegioni()
        {
            try
            {
                List<Regione> ListaRegioni = new List<Regione>();
                List<Provincia> ListaProvince = new List<Provincia>();
                List<Comune> ListaComuni = new List<Comune>();

                var ExternalUrlString = _configuration.GetSection("UrlExternalApi").GetSection("TerritorioApi").Value;

                var responseRegioni = _client.GetStringAsync(ExternalUrlString + Costanti.TerritorioGetRegioniUrl);
                var responseProvince = _client.GetStringAsync(ExternalUrlString + Costanti.TerritorioGetProvinceUrl);
                var responseComuni = _client.GetStringAsync(ExternalUrlString + Costanti.TerritorioGetComuniUrl);

                var ListRegioni = JsonConvert.DeserializeObject<RegioneDTO>(responseRegioni.ToString());
                var ListProvince = JsonConvert.DeserializeObject<ProvinciaDTO>(responseProvince.ToString());
                var ListComuni = JsonConvert.DeserializeObject<ComuneDTO>(responseComuni.ToString());

                foreach (Regione regione in ListRegioni.dati)
                {
                    regione.ListaProvince = new List<Provincia>();
                    foreach (Provincia provincia in ListProvince.elenco)
                    {
                        if (provincia.codRegione.Length > 0)
                        {
                            if (Convert.ToInt32(regione.codRegioneISTAT).Equals(Convert.ToInt32(provincia.codRegione)))
                            {
                                regione.ListaProvince.Add(provincia);
                            }
                        }

                        provincia.ListaComuni = new List<Comune>();
                        foreach (Comune comune in ListComuni.dati)
                        {
                            if (comune.codProvincia.Length > 0)
                            {
                                if (provincia.codProvincia.Equals(comune.codProvincia))
                                {
                                    provincia.ListaComuni.Add(comune);
                                }
                            }
                        }
                    }
                    ListaRegioni.Add(regione);
                }

                return ListaRegioni;
            }
            catch (Exception ex)
            { return null; }
        }
    }
}
