﻿//-----------------------------------------------------------------------
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
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadrePerBox : IGetListaSquadrePerBox
    {
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IMemoryCache _memoryCache;

        public GetListaSquadrePerBox(IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
                                     IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
                                     IMemoryCache memoryCache)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _memoryCache = memoryCache;
        }

        public async Task<List<Squadra>> Get(List<string> sedi)
        {
            try
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

                #region ListaSquadre da Fake
                var filepath = Costanti.ListaSquadre;
                string json;
                using (var r = new StreamReader(filepath))
                {
                    json = r.ReadToEnd();
                }

                var listaSquadreJson = JsonConvert.DeserializeObject<List<SquadraFake>>(json);
                #endregion


                var ListaMezzi = new List<Mezzo>();

                foreach (string CodSede in ListaCodiciSedi)
                {
                    List<Squadra> listaSquadraBySede = new List<Squadra>();
                    if (!_memoryCache.TryGetValue("listaSquadreBox-" + CodSede, out listaSquadraBySede))
                    {
                        #region LEGGO DA API ESTERNA

                        //_client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                        //var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPISquadre").Value}/GetListaSquadreByCodComando?CodComando={CodSede}").ConfigureAwait(false);
                        //response.EnsureSuccessStatusCode();
                        //using HttpContent content = response.Content;

                        //string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                        //List<SquadraFake> ListaSquadreSede = JsonConvert.DeserializeObject<List<SquadraFake>>(data);

                        #endregion LEGGO DA API ESTERNA

                        #region LEGGO DA JSON FAKE

                        List<SquadraFake> ListaSquadreSede = listaSquadreJson.FindAll(x => x.Sede.Equals(CodSede));

                        #endregion LEGGO DA JSON FAKE

                        List<Squadra> listaSquadraBySedeAppo = new List<Squadra>();

                        foreach (SquadraFake squadraFake in ListaSquadreSede)
                        {
                            var squadra = MapSquadra(squadraFake, CodSede);
                            listaSquadraBySedeAppo.Add(squadra);
                            listaSquadre.Add(squadra);
                        }

                        var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(4));
                        _memoryCache.Set("listaSquadreBox-" + CodSede, listaSquadraBySedeAppo, cacheEntryOptions);
                    }
                    else
                    {
                        listaSquadre.AddRange(listaSquadraBySede);
                    }
                }

                return listaSquadre;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private Squadra MapSquadra(SquadraFake squadraFake, string CodSede)
        {
            Squadra.StatoSquadra Stato;

            switch (squadraFake.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            var sedeDistaccamento = new Sede(squadraFake.Sede, null, null, null, "", "", "", "", "");

            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
            List<Componente> ComponentiSquadra = new List<Componente>();
            foreach (ComponenteSquadraFake componenteFake in squadraFake.ComponentiSquadra)
            {
                //PersonaleVVF pVVf = _getPersonaleByCF.Get(componenteFake.CodiceFiscale, CodSede).Result;

                Componente componente = new Componente(componenteFake.DescrizioneQualificaLunga,
                                                        "", componenteFake.Tooltip, componenteFake.CapoPartenza, componenteFake.Autista, componenteFake.Rimpiazzo)
                {
                    CodiceFiscale = componenteFake.CodiceFiscale,
                    OrarioFine = componenteFake.OrarioFine,
                    OrarioInizio = componenteFake.OrarioInizio,
                    Telefono = componenteFake.Telefono,
                    TecnicoGuardia1 = componenteFake.TecnicoGuardia1,
                    TecnicoGuardia2 = componenteFake.TecnicoGuardia2,
                    FunGuardia = componenteFake.FunGuardia,
                    CapoTurno = componenteFake.CapoTurno
                };
                ComponentiSquadra.Add(componente);
                ListaCodiciFiscaliComponentiSquadra.Add(componenteFake.CodiceFiscale);
            }

            Squadra s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento);

            s.Id = squadraFake.CodiceSquadra;
            s.Codice = squadraFake.CodiceSquadra;
            return s;
        }
    }
}
