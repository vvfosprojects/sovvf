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
        private const string URLProvvisorio = "http://wauc-test.dipvvf.it/api/Sedi";
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

            //result = result.Select(f =>
            //{
            //    if ((f?.descrizione.ToUpper().Contains("CENTRALE") ?? false) || (f?.descrizione.ToUpper().Contains("COMANDO VV.F. ") ?? false))
            //        f.descrizione = "CENTRALE " + f.id;

            //    return f;
            //}).ToList();

            return result;
        }

        public async Task<List<SedeUC>> GetDirezioniRegionali(string codSede = null)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetDirezioniRegionali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediRegionali = await _serviceDirezioni.GetAsync(url);

            //lstSediRegionali = lstSediRegionali.Select(f =>
            //{
            //    if ((f?.descrizione.ToUpper().Contains("CENTRALE") ?? false) || (f?.descrizione.ToUpper().Contains("COMANDO VV.F. ") ?? false))
            //        f.descrizione = "CENTRALE " + f.id;

            //    return f;
            //}).ToList();

            return lstSediRegionali;
        }

        public async Task<List<SedeUC>> GetFigli(string codSede = null)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetChildSede" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstFigli = await _serviceDirezioni.GetAsync(url);

            //lstFigli = lstFigli.Select(f =>
            //{
            //    if ((f?.descrizione.ToUpper().Contains("CENTRALE") ?? false) || (f?.descrizione.ToUpper().Contains("COMANDO VV.F. ") ?? false))
            //        f.descrizione = "CENTRALE " + f.provincia;

            //    return f;
            //}).ToList();

            return lstFigli.Where(f => f.tipologiaDistaccamento.codice != "14" && f.tipologiaDistaccamento.codice != "9").ToList();
        }

        public async Task<DistaccamentoUC> GetInfoSede(string codSede)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

            _serviceSedi.SetCache(codSede);

            var sede = _serviceSedi.GetAsync(url).Result;

            //if ((sede?.Descrizione.ToUpper().Contains("CENTRALE") ?? false) || (sede?.Descrizione.ToUpper().Contains("COMANDO VV.F.") ?? false))
            //    sede.Descrizione = "CENTRALE " + sede.IdSedePadre;

            return sede;
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
                Indirizzo = null
            }));

            result.AddRange(lstSedi.Figli.First().Figli.Select(f => new Sede()
            {
                Codice = f.Codice,
                Descrizione = f.Nome,
                Coordinate = f.Coordinate,
                Indirizzo = null
            }));

            result.AddRange(lstSedi.Figli.First().Figli.ToList().SelectMany(f => f.Figli.Select(ff => new Sede()
            {
                Codice = ff.Codice,
                Descrizione = ff.Nome/*.ToUpper().Replace("COMANDO VV.F. ", "CENTRALE ")*/,
                Coordinate = ff.Coordinate,
                Indirizzo = null
            })));

            result.AddRange(lstSedi.Figli.First().Figli.ToList().SelectMany(f => f.Figli.SelectMany(ff => ff.Figli.Select(fff => new Sede()
            {
                Codice = fff.Codice,
                Descrizione = fff.Nome,
                Coordinate = fff.Coordinate,
                Indirizzo = null
            }))));

            return result.Distinct().ToList();
        }

        public async Task<UnitaOperativa> ListaSediAlberata()
        {
            UnitaOperativa ListaSediAlberate = null;

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

                    var conFiglio = GetInfoSede("001").Result;

                    //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
                    var result = new UnitaOperativa(con.Id, con.Descrizione, con.Coordinate);

                    result.AddFiglio(new UnitaOperativa(conFiglio.Id, conFiglio.Descrizione, conFiglio.Coordinate));

                    //REGIONI
                    foreach (var regionale in lstRegionali)
                    {
                        var info = GetInfoSede(regionale.id).Result;

                        result.Figli.First().AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione, new Coordinate(Convert.ToDouble(info.coordinate.Split(',')[0].ToString()), Convert.ToDouble(info.coordinate.Split(',')[1].ToString()))));
                    };

                    //PROVINCE
                    foreach (var provinciale in lstProvinciali)
                    {
                        var info = GetInfoSede(provinciale.id).Result;

                        var listaComuni = GetFigli(provinciale.id).Result;

                        var lstComunali = new List<UnitaOperativa>();

                        foreach (var comune in listaComuni)
                        {
                            if (comune.coordinate.Trim().Length > 0)
                            {
                                try
                                {
                                    var unita = new UnitaOperativa(comune.id, comune.descrizione, new Coordinate(Convert.ToDouble(comune.coordinate.Split(',')[0].ToString()), Convert.ToDouble(comune.coordinate.Split(',')[1].ToString())));
                                    lstComunali.Add(unita);
                                }
                                catch
                                {
                                    if (comune.coordinate.Contains("°"))
                                    {
                                        comune.coordinate = comune.DmsToDdString(comune.coordinate);
                                        var unita = new UnitaOperativa(comune.id, comune.descrizione, new Coordinate(Convert.ToDouble(comune.coordinate.Split(',')[0].ToString()), Convert.ToDouble(comune.coordinate.Split(',')[1].ToString())));
                                        lstComunali.Add(unita);
                                    }
                                }
                            }
                            else
                            {
                                var unita = new UnitaOperativa(comune.id, comune.descrizione, new Coordinate(0, 0));
                                lstComunali.Add(unita);
                            }
                        }
                        var centrale = lstComunali.FirstOrDefault(c => c.Nome.ToLower().Contains("centrale") || c.Codice.Split('.')[1].Equals("1000"));

                        if (centrale != null)
                        {
                            lstComunali.Remove(centrale);

                            try
                            {
                                if (info.coordinate.Trim().Length > 0)
                                {
                                    var unitaComunali = new UnitaOperativa(centrale.Codice, provinciale.descrizione, new Coordinate(Convert.ToDouble(info.coordinate.Split(',')[0].ToString()), Convert.ToDouble(info.coordinate.Split(',')[1].ToString())));

                                    lstComunali.ForEach(c => unitaComunali.AddFiglio(c));

                                    result.Figli.First().Figli.FirstOrDefault(r => r.Codice?.Equals(info.IdSedePadre) ?? false)?.AddFiglio(unitaComunali);
                                }
                            }
                            catch { }
                        }
                    };

                    ListaSediAlberate = result;
                    var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                    _memoryCache.Set("ListaSediAlberate", ListaSediAlberate, cacheEntryOptions);

                    _setSediAlberate.Set(result);
                    return result;
                }
                catch (Exception e)
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
            }
            else
            {
                if (ListaSediAlberate == null)
                    _memoryCache.Remove("ListaSediAlberate");

                return ListaSediAlberate;
            }
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
            if (GetInfoSede(codiceSede).Result.coordinate == null || GetInfoSede(codiceSede).Result.coordinate.Length > 0)
                return GetInfoSede(codiceSede).Result.coordinate.Split(',');
            else
                return null;
        }
    }
}
