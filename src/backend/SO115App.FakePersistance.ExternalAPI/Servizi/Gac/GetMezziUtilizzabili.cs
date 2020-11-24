using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Classi.ServiziEsterni.Oracle;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Classi.ServiziEsterni.Gac;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;

        private readonly IGetStatoMezzi _getStatoMezzi;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetPosizioneFlotta _getPosizioneFlotta;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetStatoMezzi GetStatoMezzi,
            IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IMemoryCache memoryCache, IGetPosizioneFlotta getPosizioneFlotta)
        {
            _client = client;
            _configuration = configuration;
            _getStatoMezzi = GetStatoMezzi;
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _memoryCache = memoryCache;
            _getPosizioneFlotta = getPosizioneFlotta;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null, List<MessaggioPosizione> posizioneFlotta = null)
        {
            var pinNodi = sedi.Select(s => new PinNodo(s, true));
            var ListaCodiciComandi = new List<string>();
            var ListaCodiciSedi = new List<string>();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

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

            var ListaPosizioneFlotta = new List<MessaggioPosizione>();
            if (posizioneFlotta == null)
                ListaPosizioneFlotta = _getPosizioneFlotta.Get(0).Result;
            else
                ListaPosizioneFlotta = posizioneFlotta;

            var ListaAnagraficaMezzo = GetAnagraficaMezziByCodComando(ListaCodiciComandi).Result;

            var ListaMezzi = new List<Mezzo>();


            #region LEGGO DA API ESTERNA

            var lstMezziDto = new List<MezzoDTO>();
            try
            { 
                Parallel.ForEach(sedi, sede =>
                {
                    var httpManager = new HttpRequestManager<List<MezzoDTO>>(_memoryCache, _client);
                    httpManager.Configure("Mezzi_" + sede);

                    var lstSediQueryString = string.Join("&codiciSedi=", ListaCodiciSedi.Where(s => sede.Contains(s.Split(".")[0])).ToArray());
                    var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Classi.Costanti.GacGetMezziUtilizzabili}?codiciSedi={lstSediQueryString}");
                    lock (lstMezziDto)
                        lstMezziDto.AddRange(httpManager.GetAsync(url).Result);
                });
            }
            catch (Exception e)
            {
                throw new Exception("Elenco dei mezzi non disponibile");
            }

            #endregion LEGGO DA API ESTERNA

            //MAPPING
            ListaMezzi = lstMezziDto.Select(m =>
            {
                //if (!mezzoFake.Equals("CMOB"))
                //{
                var anagraficaMezzo = ListaAnagraficaMezzo.Find(x => x.Targa.Equals(m.Descrizione));
                var mezzo = MapMezzo(anagraficaMezzo, m);
                if (mezzo != null)
                {
                    //listaMezziBySedeAppo.Add(mezzo);
                    ListaMezzi.Add(mezzo);
                }
                //}
                return mezzo;
            }).ToList();

            ListaMezzi = ListaMezzi.Select(mezzo =>
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

                return mezzo;
            }).ToList();

            return GetListaMezziConStatoAggiornat(ListaMezzi);
        }

        private List<Mezzo> GetListaMezziConStatoAggiornat(List<Mezzo> listaMezzi)
        {
            listaMezzi = listaMezzi.Select(mezzo =>
            {
                var ListaStatoOperativoMezzo = _getStatoMezzi.Get(mezzo.Distaccamento.Codice, mezzo.Codice);
                if (ListaStatoOperativoMezzo.Count > 0)
                {
                    mezzo.Stato = ListaStatoOperativoMezzo.Find(x => x.CodiceMezzo.Equals(mezzo.Codice)).StatoOperativo;
                    mezzo.IdRichiesta = ListaStatoOperativoMezzo.FirstOrDefault(x => x.CodiceMezzo.Equals(mezzo.Codice)).CodiceRichiesta;
                }

                return mezzo;
            }).ToList();

            int i = listaMezzi.RemoveAll(x =>
            {
                return x.Coordinate == null || (x.Coordinate.Latitudine == 0 && x.Coordinate.Longitudine == 0);
            });

            return listaMezzi;
        }

        private Mezzo MapMezzo(AnagraficaMezzo anagraficaMezzo, MezzoDTO mezzoDto)
        {
            var coordinate = new Coordinate(0, 0);
            //bool CoordinateFake = false;

            var distaccamento = _getDistaccamentoByCodiceSedeUC.Get(mezzoDto.CodiceDistaccamento).Result;

            var sede = new Sede(mezzoDto.CodiceDistaccamento,
                                distaccamento != null ? distaccamento.DescDistaccamento : "",
                                distaccamento != null ? distaccamento.Indirizzo : "",
                                distaccamento != null ? distaccamento.Coordinate : null,
                                "", "", "", "", "");

            if (anagraficaMezzo != null)
            {
                Mezzo mezzo = new Mezzo(anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa,
                    anagraficaMezzo.Targa,
                    anagraficaMezzo.GenereMezzo.Codice,
                    GetStatoOperativoMezzo(anagraficaMezzo.Sede.Id, anagraficaMezzo.GenereMezzo.CodiceTipo + "." + anagraficaMezzo.Targa, mezzoDto.Movimentazione.StatoOperativo),
                   mezzoDto.CodiceDistaccamento, sede, coordinate)
                {
                    DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
                };
                return mezzo;
            }
            else
            {
                var mezzo = new Mezzo(mezzoDto.CodiceMezzo, mezzoDto.Descrizione, mezzoDto.Genere,
                GetStatoOperativoMezzo(mezzoDto.CodiceDistaccamento, mezzoDto.CodiceMezzo, mezzoDto.Movimentazione.StatoOperativo),
                mezzoDto.CodiceDistaccamento, sede, coordinate)
                {
                    DescrizioneAppartenenza = mezzoDto.DescrizioneAppartenenza,
                };
                return mezzo;
            }
        }

        private async Task<List<AnagraficaMezzo>> GetAnagraficaMezziByCodComando(List<string> ListCodComando)
        {
            var listaAnagraficaMezzo = new List<AnagraficaMezzo>();
            try
            {
                using var _client = new HttpClient();
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");

                var response = _client.GetAsync($"{_configuration.GetSection("UrlExternalApi").GetSection("MezziApidipvvf").Value}?codiciSede={string.Join(",", ListCodComando)}").Result;
                response.EnsureSuccessStatusCode();

                if (response == null)
                    throw new HttpRequestException();

                using HttpContent contentMezzo = response.Content;
                var data = await contentMezzo.ReadAsStringAsync().ConfigureAwait(false);

                listaAnagraficaMezzo = JsonConvert.DeserializeObject<List<AnagraficaMezzo>>(data);
            }
            catch (Exception e)
            {
                throw new Exception("Elenco dei mezzi non disponibile");
            }

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
