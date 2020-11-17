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
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.API.Models.Classi.Organigramma;
using Microsoft.Extensions.Caching.Memory;
using System;
using SO115App.ExternalAPI.Fake.HttpManager;
using System.Net.Http.Headers;

namespace SO115App.ExternalAPI.Fake.GestioneMezzi
{
    public class GetMezziUtilizzabiliPerBox : IGetMezziUtilizzabiliPerBox

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPosizioneByCodiceMezzo _getPosizioneByCodiceMezzo;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IMemoryCache _memoryCache;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        public GetMezziUtilizzabiliPerBox(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
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

            #region LEGGO DA JSON FAKE

            //var filepath = Costanti.ListaMezzi;
            //string json;
            //using (var r = new StreamReader(filepath))
            //{
            //    json = r.ReadToEnd();
            //}
            //var listaMezzi = JsonConvert.DeserializeObject<List<MezzoFake>>(json);

            #endregion LEGGO DA JSON FAKE

            var httpManager = new HttpRequestManager<List<MezzoDTO>>(_client);
            httpManager.Configure();

            _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "test");

            foreach (string CodSede in ListaCodiciSedi)
            {
                var listaMezziBySede = new List<Mezzo>();
                string nomeCache = "M_PerBox_" + CodSede.Replace(".", "");
                if (!_memoryCache.TryGetValue(nomeCache, out listaMezziBySede))
                {
                    #region LEGGO DA API ESTERNA

                    var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetMezziUtilizzabili}?codiciSedi={CodSede}");
                    var result = await httpManager.ExecuteGet(url);

                    var listaMezzi = result;

                    #endregion LEGGO DA API ESTERNA

                    var ListaMezziSede = listaMezzi.FindAll(x => x.CodiceDistaccamento.Equals(CodSede)).ToList();

                    var listaMezziBySedeAppo = new List<Mezzo>();
                    foreach (var mezzoFake in ListaMezziSede)
                    {
                        //if (!mezzoFake.Equals("CMOB"))
                        //{
                            var mezzo = MapMezzo(mezzoFake);
                            if (mezzo != null)
                            {
                                listaMezziBySedeAppo.Add(mezzo);
                                ListaMezzi.Add(mezzo);
                            }
                        //}
                    }

                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));
                    _memoryCache.Set(nomeCache, listaMezzi, cacheEntryOptions);
                }
                else
                {
                    ListaMezzi.AddRange(listaMezziBySede);
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
                else
                {
                    mezzo.Stato = Costanti.MezzoInSede;
                }
            }

            return listaMezzi;
        }

        private Mezzo MapMezzo(MezzoDTO mezzoDto)
        {
            var coordinate = new Coordinate(0, 0);

            var sede = new Sede(mezzoDto.CodiceDistaccamento, null, null, null, "", "", "", "", "");

            var mezzo = new Mezzo(mezzoDto.CodiceMezzo, mezzoDto.Descrizione, mezzoDto.Genere, 
                GetStatoOperativoMezzo(mezzoDto.CodiceDistaccamento, mezzoDto.CodiceMezzo, mezzoDto.Movimentazione.StatoOperativo),
                mezzoDto.CodiceDistaccamento, sede, coordinate)
            {
                DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
            };

            return mezzo;
        }

        private string GetStatoOperativoMezzo(string codiceSedeDistaccamento, string codiceMezzo, string StatoMezzoOra)
        {
            string stato;
            if (StatoMezzoOra.Equals("I"))
            {
                stato = SO115App.Models.Classi.Utility.Costanti.MezzoSulPosto;
            }
            else
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(codiceSedeDistaccamento, codiceMezzo);
                if (ListaStatoOperativoMezzo.Count == 0)
                {
                    switch (StatoMezzoOra)
                    {
                        case "D": stato = SO115App.Models.Classi.Utility.Costanti.MezzoInSede; break;
                        case "R": stato = SO115App.Models.Classi.Utility.Costanti.MezzoInRientro; break;
                        case "O": stato = SO115App.Models.Classi.Utility.Costanti.MezzoOperativoPreaccoppiato; break;
                        case "A": stato = SO115App.Models.Classi.Utility.Costanti.MezzoAssegnatoPreaccoppiato; break;
                        default: stato = SO115App.Models.Classi.Utility.Costanti.MezzoStatoSconosciuto; break;
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
