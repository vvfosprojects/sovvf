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
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetSedi : IGetDirezioni, IGetSedi, IGetAlberaturaUnitaOperative, IGetListaDistaccamentiByPinListaSedi, 
        IGetDistaccamentoByCodiceSedeUC, IGetDistaccamentoByCodiceSede,
        IGetSediMarker, IGetCoordinateByCodSede
    {

        private string URLProvvisorio = "http://wauc-test.dipvvf.it/api/Sedi";
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
            if (codSede != null)
            {
                var url = new Uri(baseurl + "/GetComandiProvinciali" + "?codSede=" + codSede);
                _serviceDirezioni.SetCache(url.AbsoluteUri);
                var lstSediProvinciali = await _serviceDirezioni.GetAsync(url);
                return lstSediProvinciali;
            }
            else
            {
                var url = new Uri(baseurl + "/GetComandiProvinciali");
                _serviceDirezioni.SetCache(url.AbsoluteUri);
                var lstSediProvinciali = await _serviceDirezioni.GetAsync(url);
                return lstSediProvinciali;
            }
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

            return lstFigli;
        }

        public async Task<DistaccamentoUC> GetInfoSede(string codSede)
        {
            var baseurl = URLProvvisorio; // _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

            _serviceSedi.SetCache(url.AbsoluteUri);

            var sede = _serviceSedi.GetAsync(url).Result;

            if(sede!=null)
                if(sede.Descrizione.Equals("CENTRALE"))
                    sede.Descrizione = sede.Descrizione + " " + sede.IdSedePadre;

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
                Descrizione = ff.Nome,
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

                    List<SedeUC> lstFigli = new List<SedeUC>();
                    foreach(var sede in lstProvinciali)
                    {
                        var figli = GetFigli(sede.id).Result;
                        lstFigli.AddRange(figli);
                    }

                    var con = GetInfoSede("00").Result;

                    var conFiglio = GetInfoSede("001").Result;

                    //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
                    var result = new UnitaOperativa(con.Id, con.Descrizione, con.Coordinate);

                    result.AddFiglio(new UnitaOperativa(conFiglio.Id, conFiglio.Descrizione, conFiglio.Coordinate));

                    //REGIONI
                    foreach(var regionale in lstRegionali)
                    {
                        var info = GetInfoSede(regionale.id).Result;

                        result.Figli.First().AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione, info.Coordinate));
                    };

                    //PROVINCE
                    foreach(var provinciale in lstProvinciali)
                    {
                        var info = GetInfoSede(provinciale.id).Result;

                        if(info != null) { 
                        if(provinciale.id.Equals("CA"))
                        {

                        }


                        var lstComunali = GetFigli(provinciale.id).Result
                            .Select(comunale => new UnitaOperativa(comunale.id, comunale.descrizione, comunale.Coordinate)).ToHashSet().ToList();

                        var centrale = lstComunali.FirstOrDefault(c => c.Nome.ToLower().Contains("centrale") || c.Codice.Split('.')[1].Equals("1000"));

                            if (centrale != null)
                            {
                                lstComunali.Remove(centrale);

                                if (centrale.Codice.Equals("GO.1000"))
                                {

                                }

                                try
                                {
                                    var unitaComunali = new UnitaOperativa(centrale.Codice, provinciale.descrizione, info.Coordinate);
                                    lstComunali.ForEach(c => unitaComunali.AddFiglio(c));
                                    result.Figli.First().Figli.FirstOrDefault(r => r.Codice?.Equals(info.IdSedePadre) ?? false)?
                                        .AddFiglio(unitaComunali);
                                }
                                catch (Exception ex)
                                {

                                }


                            }
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
                    var cacheEntryOptionsBk = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                    _memoryCache.Set("ListaSediAlberate", sedi, cacheEntryOptionsBk);

                    return sedi;
                    //throw new Exception("Errore costruzione alberatura sedi di servizio.");
                }


            }
            else
            {

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
            var listaSediMarker = new List<SedeMarker>();

            var listaSedi = GetAll();

            Parallel.ForEach(listaSedi.Result, sede =>
            {
                var sedeMarker = new SedeMarker();

                if (Filtro == null)
                {
                    listaSediMarker.Add(sedeMarker);
                }
                else if ((sede.Coordinate.Latitudine >= Filtro.BottomLeft.Latitudine)
                        && (sede.Coordinate.Latitudine <= Filtro.TopRight.Latitudine)
                        && (sede.Coordinate.Longitudine >= Filtro.BottomLeft.Longitudine)
                        && (sede.Coordinate.Longitudine <= Filtro.TopRight.Longitudine))
                {
                    sedeMarker.Codice = sede.Codice;
                    sedeMarker.Coordinate = sede.Coordinate;
                    sedeMarker.Descrizione = sede.Descrizione;
                    sedeMarker.Provincia = null;
                    sedeMarker.Tipo = GetTipoSede(sede);

                    listaSediMarker.Add(sedeMarker);
                }
            });

            return listaSediMarker;
        }

        private string GetTipoSede(Sede sede)
        {
            if (sede.Descrizione.Contains("Comando"))
                return "Comando";
            else if (sede.Descrizione.Contains("Distaccamento"))
                return "Distaccamento";
            else
                return "Direzione";
        }

        Coordinate IGetCoordinateByCodSede.Get(string codiceSede)
        {
            return GetInfoSede(codiceSede).Result.Coordinate;
        }
    }
}
