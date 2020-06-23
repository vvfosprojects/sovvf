using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using Newtonsoft.Json;
using System.IO;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.API.Models.Classi.Organigramma;
using Microsoft.Extensions.Caching.Memory;
using System;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IMemoryCache _memoryCache;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC, IGetPosizioneByCodiceMezzo getPosizioneByCodiceMezzo,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IMemoryCache memoryCache, IGetPosizioneFlotta getPosizioneFlotta)
        {
            _client = client;
            _configuration = configuration;
            _getStatoMezzi = GetStatoMezzi;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPosizioneByCodiceMezzo = getPosizioneByCodiceMezzo;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _memoryCache = memoryCache;
            _getPosizioneFlotta = getPosizioneFlotta;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            var ListaCodiciSedi = new List<string>();
            var ListaCodiciComandi = new List<string>();

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
                    if (!ListaCodiciComandi.Contains(codice.Split('.')[0]))
                        ListaCodiciComandi.Add(codice.Split('.')[0]);
                    ListaCodiciSedi.Add(codice);
                }
            }

            var ListaAnagraficaMezzo = new List<AnagraficaMezzo>();
            var ListaMezzi = new List<Mezzo>();
            var ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;

            ListaAnagraficaMezzo = GetAnagraficaMezziByCodComando(ListaCodiciComandi).Result;

            #region LEGGO DA JSON FAKE

            var filepath = Costanti.ListaMezzi;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            var listaMezzi = JsonConvert.DeserializeObject<List<MezzoFake>>(json);

            #endregion LEGGO DA JSON FAKE

            foreach (string CodSede in ListaCodiciSedi)
            {
                List<Mezzo> listaMezziBySede = new List<Mezzo>();
                string nomeCache = "M_" + CodSede.Replace(".", "");
                if (!_memoryCache.TryGetValue(nomeCache, out listaMezziBySede))
                {
                    #region LEGGO DA API ESTERNA

                    //_client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                    //var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPIMezzi").Value}/GetListaMezziByCodComando?CodComando={CodSede}").ConfigureAwait(false);
                    //response.EnsureSuccessStatusCode();
                    //using HttpContent content = response.Content;
                    //var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                    //var ListaMezziSede = JsonConvert.DeserializeObject<List<MezzoFake>>(data);

                    #endregion LEGGO DA API ESTERNA

                    var ListaMezziSede = listaMezzi.FindAll(x => x.Sede.Equals(CodSede)).ToList();

                    List<Mezzo> listaMezziBySedeAppo = new List<Mezzo>();
                    foreach (MezzoFake mezzoFake in ListaMezziSede)
                    {
                        if (!mezzoFake.CodDestinazione.Equals("CMOB"))
                        {
                            var anagraficaMezzo = ListaAnagraficaMezzo.Find(x => x.Targa.Equals(mezzoFake.Targa)); //GetAnagraficaMezzoByTarga(mezzoFake.Targa).Result;

                            var mezzo = MapMezzo(anagraficaMezzo, mezzoFake);
                            if (mezzo != null)
                            {
                                listaMezziBySedeAppo.Add(mezzo);
                                ListaMezzi.Add(mezzo);
                            }
                        }
                    }

                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                    _memoryCache.Set(nomeCache, listaMezziBySedeAppo, cacheEntryOptions);
                }
                else
                {
                    ListaMezzi.AddRange(listaMezziBySede);
                }
            }

            foreach (var mezzo in ListaMezzi)
            {
                var CoordinateMezzoGeoFleet = ListaPosizioneFlotta.Find(x => x.CodiceMezzo.Equals(mezzo.Codice));

                if (CoordinateMezzoGeoFleet == null)
                {
                    mezzo.Coordinate = mezzo.Distaccamento.Coordinate;
                    mezzo.CoordinateFake = true;
                }
                else
                {
                    mezzo.Coordinate = new Coordinate(CoordinateMezzoGeoFleet.Localizzazione.Lat, CoordinateMezzoGeoFleet.Localizzazione.Lon);
                    mezzo.CoordinateFake = false;
                }
            }

            return GetListaMezziConStatoAggiornat(ListaMezzi);
        }

        private List<Mezzo> GetListaMezziConStatoAggiornat(List<Mezzo> listaMezzi)
        {
            foreach (Mezzo mezzo in listaMezzi)
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(mezzo.Distaccamento.Codice, mezzo.Codice);
                if (ListaStatoOperativoMezzo.Count > 0)
                {
                    mezzo.Stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)).StatoOperativo;
                }
            }

            int i = listaMezzi.RemoveAll(x => x.Coordinate.Latitudine == 0 && x.Coordinate.Longitudine == 0);

            return listaMezzi;
        }

        private Mezzo MapMezzo(AnagraficaMezzo anagraficaMezzo, MezzoFake mezzoFake)
        {
            var coordinate = new Coordinate(0, 0);
            //bool CoordinateFake = false;

            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(mezzoFake.Sede).Result;

            var sede = new Sede(mezzoFake.Sede,
                                distaccamento != null ? distaccamento.DescDistaccamento : "",
                                distaccamento != null ? distaccamento.Indirizzo : "",
                                distaccamento != null ? distaccamento.Coordinate : null,
                                "", "", "", "", "");

            if (anagraficaMezzo != null)
            {
                Mezzo mezzo = new Mezzo(anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa,
                    anagraficaMezzo.Targa,
                    anagraficaMezzo.GenereMezzo.Codice,
                    GetStatoOperativoMezzo(anagraficaMezzo.Sede.Id, anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa, mezzoFake.Stato),
                   mezzoFake.CodDestinazione, sede, coordinate)
                {
                    DescrizioneAppartenenza = mezzoFake.DescDestinazione,
                };
                return mezzo;
            }
            else
            {
                Mezzo mezzo = null;
                return mezzo;
            }
        }

        private async Task<List<AnagraficaMezzo>> GetAnagraficaMezziByCodComando(List<string> ListCodComando)
        {
            string combindedString = string.Join(",", ListCodComando);
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?codiciSede={combindedString}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent contentMezzo = response.Content;
            var data = await contentMezzo.ReadAsStringAsync().ConfigureAwait(false);

            var listaAnagraficaMezzo = new List<AnagraficaMezzo>();
            listaAnagraficaMezzo = JsonConvert.DeserializeObject<List<AnagraficaMezzo>>(data);

            return listaAnagraficaMezzo;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            if (StatoMezzoOra.Equals("I"))
            {
                stato = Costanti.MezzoSulPosto;
            }
            else
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = Costanti.MezzoInSede; break;
                        case "R": stato = Costanti.MezzoInRientro; break;
                        case "O": stato = Costanti.MezzoOperativoPreaccoppiato; break;
                        case "A": stato = Costanti.MezzoAssegnatoPreaccoppiato; break;
                        default: stato = Costanti.MezzoStatoSconosciuto; break;
                    }
                }
                else
                {
                    stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(codiceMezzo)).StatoOperativo;
                }
            }
            return stato;
        }
    }
}
