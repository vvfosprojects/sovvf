using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Classi.ServiziEsterni.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSedi;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetSedi : IGetDirezioni, IGetSedi, IGetAlberaturaUnitaOperative, IGetListaDistaccamentiByPinListaSedi,
        IGetDistaccamentoByCodiceSedeUC, IGetDistaccamentoByCodiceSede,
        IGetSediMarker, IGetCoordinateByCodSede, IGetStringCoordinateByCodSede
    {
        private const string URLProvvisorio = "http://wauc.dipvvf.it/api/Sedi";
        private readonly IHttpRequestManager<List<SedeUC>> _serviceDirezioni;
        private readonly IHttpRequestManager<DistaccamentoUC> _serviceSedi;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _memoryCache;
        private readonly IGetAllSediAlberate _getAllSediAlberate;
        private readonly ISetSediAlberate _setSediAlberate;

        public GetSedi(IHttpRequestManager<List<SedeUC>> serviceDirezioni,
                       IHttpRequestManager<DistaccamentoUC> serviceSedi,
                       IConfiguration config,
                       IMemoryCache memoryCache,
                       IGetAllSediAlberate getAllSediAlberate,
                       ISetSediAlberate setSediAlberate)
        {
            _serviceDirezioni = serviceDirezioni;
            _serviceSedi = serviceSedi;
            _config = config;
            _memoryCache = memoryCache;
            _getAllSediAlberate = getAllSediAlberate;
            _setSediAlberate = setSediAlberate;
        }

        public async Task<List<SedeUC>> GetDirezioniProvinciali(string codSede = null)
        {
            var baseurl = URLProvvisorio; //_config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");

            List<SedeUC> result = null;

            if (codSede != null)
            {
                var url = new Uri(baseurl + "/GetComandiProvinciali" + "?codSede=" + codSede);
                _serviceDirezioni.SetCache(url.AbsoluteUri);
                result = await _serviceDirezioni.GetAsync(url);
            }
            else
            {
                var url = new Uri(baseurl + "/GetComandiProvinciali");
                _serviceDirezioni.SetCache(url.AbsoluteUri);
                result = await _serviceDirezioni.GetAsync(url);
            }

            return result;
        }

        public async Task<List<SedeUC>> GetDirezioniRegionali(string codSede = null)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetDirezioniRegionali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediRegionali = await _serviceDirezioni.GetAsync(url);

            return lstSediRegionali;
        }

        public async Task<List<SedeUC>> GetFigli(string codSede = null)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetChildSede" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstFigli = await _serviceDirezioni.GetAsync(url);

            return lstFigli.Where(f => f.tipologiaDistaccamento.codice != "14" && f.tipologiaDistaccamento.codice != "9").ToList();
        }

        public async Task<DistaccamentoUC> GetInfoSede(string codSede)
        {
            try
            {
                DistaccamentoUC sede = new DistaccamentoUC();
                if (!_memoryCache.TryGetValue($"InfoSede{codSede}", out sede))
                {
                    var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
                    var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

                    _serviceSedi.SetCache(codSede);

                    sede = _serviceSedi.GetAsync(url).Result;

                    if (sede == null)
                        return get(codSede);

                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                    _memoryCache.Set($"InfoSede{codSede}", sede, cacheEntryOptions);

                    return sede;
                }
                else
                {
                    return sede;
                }
            }
            catch (Exception)
            {
                return get(codSede);
            }

            DistaccamentoUC get(string codSede)
            {
                var distaccamento = GetAll().Result.FirstOrDefault(s => s.Codice.Equals(codSede));

                if (distaccamento == null)
                    return null;

                return new DistaccamentoUC()
                {
                    CodDistaccamento = distaccamento.Codice,
                    Descrizione = distaccamento.Descrizione,
                    coordinate = distaccamento.CoordinateString != null ? string.Join(", ", distaccamento.CoordinateString) : null,
                    Indirizzo = distaccamento.Indirizzo
                };
            }
        }

        public async Task<List<Sede>> GetAll()
        {
            var result = new List<Sede>();

            var lstSedi = ListaSediAlberata().Result;

            result.AddRange(lstSedi.Figli.Select(f => new Sede()
            {
                Codice = f.Codice,
                Descrizione = f.Nome,
                Coordinate = f.Coordinate,
                CoordinateString = f.CoordinateString.Split(','),
                Indirizzo = null
            }));

            result.AddRange(lstSedi.Figli.ToList().SelectMany(f => f.Figli.Select(ff => new Sede()
            {
                Codice = ff.Codice,
                Descrizione = ff.Nome,
                Coordinate = ff.Coordinate,
                CoordinateString = ff.CoordinateString.Split(','),
                Indirizzo = null
            }
             )));

            result.AddRange(lstSedi.Figli.ToList().SelectMany(f => f.Figli.SelectMany(ff => ff.Figli.Select(fff => new Sede()
            {
                Codice = fff.Codice,
                Descrizione = fff.Nome,
                Coordinate = fff.Coordinate,
                CoordinateString = fff.CoordinateString.Split(','),
                Indirizzo = null
            }))));

            return result.Distinct().ToList();
        }

        public async Task<UnitaOperativa> ListaSediAlberata()
        {
            UnitaOperativa ListaSediAlberate = null;//

#if DEBUG

            //return readOffline();

#endif

            if (!_memoryCache.TryGetValue("ListaSediAlberate", out ListaSediAlberate))
            {
                //OTTENGO TUTTE LE SEDI, PER OGNI LIVELLO

                try
                {
                    var lstRegionali = GetDirezioniRegionali().Result;

                    var lstProvinciali = GetDirezioniProvinciali().Result;

                    //Le coordinate sono fisse perchè il CON prende tutta italia
                    var con = GetInfoSede("00").Result;
                    con.coordinate = "42.28313392189123,11.682171591796926";

                    //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
                    var result = new UnitaOperativa(con.Id, con.Descrizione, con.Coordinate);

                    //REGIONI
                    Parallel.ForEach(lstRegionali, regionale =>
                    {
                        var info = GetInfoSede(regionale.id).Result;

                        result.AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione, new Coordinate(Convert.ToDouble(info.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[0].Replace('.', ',')), Convert.ToDouble(info.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[1].Replace('.', ',')))) { CoordinateString = info.coordinate });
                    });

                    foreach (var regione in result.Figli)
                    {
                        var listaComuni = GetFigli(regione.Codice).Result;

                        foreach (var comune in listaComuni)
                        {
                            var infoComune = GetInfoSede(comune.id).Result;
                            regione.AddFiglio(new UnitaOperativa(comune.id, comune.descrizione, new Coordinate(Convert.ToDouble(infoComune.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[0].Replace('.', ',')), Convert.ToDouble(infoComune.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[1].Replace('.', ',')))) { CoordinateString = infoComune.coordinate });
                        }
                    };

                    foreach (var comune in result.Figli.ToList().SelectMany(r => r.Figli))
                    {
                        var listaDistaccamenti = GetFigli(comune.Codice).Result;
                        foreach (var distaccamento in listaDistaccamenti)
                        {
                            if (distaccamento.tipologiaDistaccamento.codice.Equals(2))
                            {
                                var infoDistaccamento = GetInfoSede(distaccamento.id).Result;
                                comune.AddFiglio(new UnitaOperativa(distaccamento.id, distaccamento.descrizione, new Coordinate(Convert.ToDouble(infoDistaccamento.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[0].Replace('.', ',')), Convert.ToDouble(infoDistaccamento.coordinate.Split(',', StringSplitOptions.RemoveEmptyEntries)[1].Replace('.', ',')))) { CoordinateString = infoDistaccamento.coordinate });
                            }
                        }
                    }

                    ListaSediAlberate = result;
                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                    _memoryCache.Set("ListaSediAlberate", ListaSediAlberate, cacheEntryOptions);

                    _setSediAlberate.Set(result);
                    return result;
                }
                catch (Exception e)
                {
                    return readOffline();
                }
            }
            else
            {
                if (ListaSediAlberate == null)
                    _memoryCache.Remove("ListaSediAlberate");

                return ListaSediAlberate;
            }
        }

        private UnitaOperativa readOffline()
        {
            var sedi = _getAllSediAlberate.GetSediAlberate();

            if (sedi != null)
            {
                var cacheEntryOptionsBk = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                _memoryCache.Set("ListaSediAlberate", sedi, cacheEntryOptionsBk);
                return sedi;
            }
            else
                throw new Exception("Errore costruzione alberatura sedi di servizio.");
        }

        public List<Distaccamento> GetListaDistaccamenti(List<PinNodo> listaPin = null)
        {
            var lstCodici = listaPin?.Select(p => p.Codice).ToList();

            var result = GetAll();

            if (listaPin == null)
                return result.Result.Select(s => s.MapDistaccamento()).ToList();
            else
                return result.Result.Where(s => lstCodici.Any(c => c.ToUpper().Equals(s.Codice.ToUpper()))).Select(s => s.MapDistaccamento()).ToList();
        }

        /// <summary>
        ///   metodo della classe che restituisce un Distaccamento
        /// </summary>
        /// <param name="codiceSede"></param>
        /// <returns>un task contenente il distaccamento</returns>
        public async Task<Distaccamento> Get(string codiceSede)
        {
            var sede = GetInfoSede(codiceSede);

            var result = sede.Result?.MapDistaccamento();

            return result;
        }

        public Sede GetSede(string codiceSede)
        {
            var dist = GetInfoSede(codiceSede);

            var result = dist.Result.MapSede();

            return result;
        }

        public List<SedeMarker> GetListaSediMarker(AreaMappa Filtro)
        {
            var listaSediMarker = new ConcurrentBag<SedeMarker>();

            var listaSedi = GetAll();

            Parallel.ForEach(listaSedi.Result, sede =>
            {
                var sedeMarker = new SedeMarker();

                if (Filtro == null)
                {
                    listaSediMarker.Add(sedeMarker);
                }
                //else if ((sede.Coordinate.Latitudine >= Filtro.BottomLeft.Latitudine)
                //        && (sede.Coordinate.Latitudine <= Filtro.TopRight.Latitudine)
                //        && (sede.Coordinate.Longitudine >= Filtro.BottomLeft.Longitudine)
                //        && (sede.Coordinate.Longitudine <= Filtro.TopRight.Longitudine))
                else
                {
                    sedeMarker.Codice = sede.Codice;
                    sedeMarker.Coordinate = sede.Coordinate;
                    sedeMarker.Descrizione = sede.Descrizione;
                    sedeMarker.Provincia = null;
                    sedeMarker.Tipo = GetTipoSede(sede);

                    listaSediMarker.Add(sedeMarker);
                }
            });

            return listaSediMarker.ToList();
        }

        private static string GetTipoSede(Sede sede)
        {
            if (sede.Codice.Contains(".1000"))
                return "Comando";
            else
            {
                if (!sede.Codice.Contains(".1000"))
                {
                    if (!sede.Codice.Contains("."))
                        return "Direzione";
                    else
                        return "Distaccamento";
                }
                else
                    return "Comando";
            }
        }

        Coordinate IGetCoordinateByCodSede.Get(string codiceSede)
        {
            return GetInfoSede(codiceSede).Result.Coordinate;
        }

        string[] IGetStringCoordinateByCodSede.Get(string codiceSede)
        {
            var result = GetInfoSede(codiceSede).Result;

            if (result == null)
                return null;

            if (result.coordinate == null || result.coordinate.Length > 0)
                return GetInfoSede(codiceSede).Result.coordinate.Split(',');
            else
                return null;
        }

        public string GetCodiceSedePadre(string codiceSede)
        {
            if (!codiceSede.Equals("00"))
            {
                var SediAlberate = ListaSediAlberata().Result;
                var pin = new PinNodo(codiceSede);
                var pinNodi = new List<PinNodo>();
                pinNodi.Add(pin);
                var UnitaOperativaAnagrafica = SediAlberate.GetSottoAlbero(pinNodi);
                List<string> ListaCodiciSediInteressate = new List<string>();

                UnitaOperativa unitaperativa = new UnitaOperativa(codiceSede, UnitaOperativaAnagrafica.ToList()[0].Nome)
                {
                    Figli = UnitaOperativaAnagrafica.ToList()[0].Figli
                };

                var codicePadre = "";

                Parallel.ForEach(SediAlberate.Figli, sede =>
                {
                    if (sede.Equals(unitaperativa))
                    {
                        codicePadre = "00";
                    }
                    else
                    {
                        foreach (var comune in sede.Figli)
                        {
                            if (comune.Equals(unitaperativa))
                            {
                                codicePadre = sede.Codice;
                            }
                        }
                    }
                });

                return codicePadre;
            }
            else
            {
                return "";
            }
        }
    }
}
