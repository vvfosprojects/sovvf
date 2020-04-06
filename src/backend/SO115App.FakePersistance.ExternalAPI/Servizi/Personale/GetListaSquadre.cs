//-----------------------------------------------------------------------
// <copyright file="GetListaSquadre.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.IO;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IMemoryCache _memoryCache;

        public GetListaSquadre(HttpClient client, IConfiguration configuration,
             IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
             IGetPersonaleByCF GetPersonaleByCF,
             IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
             IMemoryCache memoryCache)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _memoryCache = memoryCache;
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<Squadra>> Get(List<string> sedi)
        {
            List<Squadra> listaSquadre = new List<Squadra>();
            List<string> ListaCodiciSedi = new List<string>();

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            foreach (var sede in sedi)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.GetSottoAlbero(pinNodi))
            {
                var codice = figlio.Codice;
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    ListaCodiciSedi.Add(codice);
                }
            }

            var ListaMezzi = new List<Mezzo>();

            foreach (string CodSede in ListaCodiciSedi)
            {
                List<Squadra> listaSquadraBySede = new List<Squadra>();
                if (!_memoryCache.TryGetValue("listaSquadre-" + CodSede, out listaSquadraBySede))
                {
                    _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                    var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPISquadre").Value}/GetListaSquadreByCodComando?CodComando={CodSede}").ConfigureAwait(false);
                    response.EnsureSuccessStatusCode();
                    using HttpContent content = response.Content;

                    string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                    List<SquadraFake> ListaSquadreSede = JsonConvert.DeserializeObject<List<SquadraFake>>(data);
                    List<Squadra> listaSquadraBySedeAppo = new List<Squadra>();

                    foreach (SquadraFake squadraFake in ListaSquadreSede)
                    {
                        var squadra = MapSqaudra(squadraFake, CodSede);
                        listaSquadraBySedeAppo.Add(squadra);
                        listaSquadre.Add(squadra);
                    }

                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(4));
                    _memoryCache.Set("listaSquadre-" + CodSede, listaSquadraBySedeAppo, cacheEntryOptions);
                }
                else
                {
                    listaSquadre.AddRange(listaSquadraBySede);
                }
            }

            return listaSquadre;
        }

        private Squadra MapSqaudra(SquadraFake squadraFake, string CodSede)
        {
            Squadra.StatoSquadra Stato;

            switch (squadraFake.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            var distaccamento = new Distaccamento();
            distaccamento = _getDistaccamentoByCodiceSedeUC.Get(squadraFake.Sede).Result;
            var sedeDistaccamento = new Sede(squadraFake.Sede, distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate, "", "", "", "", "");

            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
            List<Componente> ComponentiSquadra = new List<Componente>();
            foreach (ComponenteSquadraFake componenteFake in squadraFake.ComponentiSquadra)
            {
                PersonaleVVF pVVf = _getPersonaleByCF.Get(componenteFake.CodiceFiscale).Result;

                Componente componente = new Componente(componenteFake.DescrizioneQualificaLunga,
                pVVf.Nominativo, componenteFake.Tooltip, componenteFake.CapoPartenza, componenteFake.Autista, componenteFake.Rimpiazzo)
                {
                    CodiceFiscale = pVVf.CodFiscale,
                    OrarioFine = componenteFake.OrarioFine,
                    OrarioInizio = componenteFake.OrarioInizio,
                    Telefono = componenteFake.Telefono,
                    TecnicoGuardia1 = componenteFake.TecnicoGuardia1,
                    TecnicoGuardia2 = componenteFake.TecnicoGuardia2,
                    FunGuardia = componenteFake.FunGuardia,
                    CapoTurno = componenteFake.CapoTurno
                };
                ComponentiSquadra.Add(componente);
                ListaCodiciFiscaliComponentiSquadra.Add(pVVf.CodFiscale);
            }

            Squadra s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento);

            s.Id = squadraFake.CodiceSquadra;
            s.Codice = squadraFake.CodiceSquadra;
            s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
            return s;
        }
    }
}
