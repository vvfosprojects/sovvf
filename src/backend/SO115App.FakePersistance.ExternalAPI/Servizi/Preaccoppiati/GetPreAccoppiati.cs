﻿using System.Collections.Generic;
using System.Net.Http;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using Microsoft.Extensions.Caching.Memory;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using SO115App.Models.Classi.Utility;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Servizi.Preaccoppiati

{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        public GetPreAccoppiati(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }

        public List<PreAccoppiati> Get(PreAccoppiatiQuery query)
        {
            return GetAsync(query).Result;
        }

        public async Task<List<PreAccoppiati>> GetAsync(PreAccoppiatiQuery query)
        {
            List<PreAccoppiati> ListaPreAccoppiati = new List<PreAccoppiati>();

            string CodSede = query.CodiceSede.FirstOrDefault().Substring(0, 2);
            if (!_memoryCache.TryGetValue("ListaPreAccoppiati", out ListaPreAccoppiati))
            {
                #region LEGGO DA API ESTERNA

                //_client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                //var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPIPreAccoppiati").Value}/GetListaPreaccoppiatiByCodComando?CodComando={CodSede}").ConfigureAwait(false);
                //response.EnsureSuccessStatusCode();
                //using HttpContent content = response.Content;
                //string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                //var ListaPreAccoppiatiFake = JsonConvert.DeserializeObject<List<PreAccoppiatiFake>>(data);

                #endregion LEGGO DA API ESTERNA

                #region LEGGO DA JSON FAKE

                var filepath = Costanti.ListaPreAccoppiati;
                string json;
                using (var r = new StreamReader(filepath))
                {
                    json = r.ReadToEnd();
                }

                var listaPreaccoppiati = JsonConvert.DeserializeObject<List<PreAccoppiatiFake>>(json);

                var ListaPreAccoppiatiFake = listaPreaccoppiati.FindAll(x => x.Sede.Split('.')[0].Equals(CodSede));

                #endregion LEGGO DA JSON FAKE

                ListaPreAccoppiati = MapPreAccoppiati(ListaPreAccoppiatiFake);
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));
                _memoryCache.Set("ListaPreAccoppiati", ListaPreAccoppiati, cacheEntryOptions);
            }
            return ListaPreAccoppiati;
        }

        public List<PreAccoppiatiFakeJson> GetFake(PreAccoppiatiQuery query)
        {
            var preAccoppiati = new List<PreAccoppiatiFakeJson>();
            string filepath = "Fake/PreAccoppiatiComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            preAccoppiati = JsonConvert.DeserializeObject<List<PreAccoppiatiFakeJson>>(json);

            return preAccoppiati
                .Where(x => query.CodiceSede.Contains(x.CodiceSede))
                .Where(c =>
                {
                    if(c.MezzoComposizione.Mezzo.IdRichiesta != null)
                        return c.MezzoComposizione.Mezzo.IdRichiesta == query.Filtri.IdRichiesta;
                    return true;
                })
                .Where(c =>
                {
                    if (query.Filtri.StatoMezzo != null)
                        return query.Filtri.StatoMezzo.Contains(c.MezzoComposizione.Mezzo.Stato);
                    return true;
                }).Where(c =>
                {
                    if (query.Filtri.TipoMezzo != null)
                        return query.Filtri.TipoMezzo.Contains(c.MezzoComposizione.Mezzo.Genere);
                    return true;
                }).Where(c =>
                {
                    if (query.Filtri.CodiceDistaccamento != null)
                        return query.Filtri.CodiceDistaccamento.Contains(c.MezzoComposizione.Mezzo.Distaccamento.Codice);
                    return true;
                }).ToList();
        }

        private List<PreAccoppiati> MapPreAccoppiati(List<PreAccoppiatiFake> ListaPreAccoppiatiFake)
        {
            List<PreAccoppiati> ListaPreAccoppiati = new List<PreAccoppiati>();
            List<string> sList = new List<string>();
            foreach (PreAccoppiatiFake preAccoppiatiFake in ListaPreAccoppiatiFake)
            {
                PreAccoppiati preAccoppiati = new PreAccoppiati
                {
                    Id = preAccoppiatiFake.Sede + "-" + preAccoppiatiFake.Mezzo,
                    Mezzo = preAccoppiatiFake.Mezzo,
                    CodiceSede = preAccoppiatiFake.Sede
                };
                foreach (string s in preAccoppiatiFake.Squadre)
                {
                    sList.Add(s);
                }
                string[] squadre = sList.ToArray();
                preAccoppiati.Squadre = squadre;
                ListaPreAccoppiati.Add(preAccoppiati);
            }

            return ListaPreAccoppiati;
        }
    }
}
