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
using SO115App.Models.Servizi.Infrastruttura.Marker;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze;
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
        IGetSediMarker, IGetCoordinateByCodSede, IGetCompetenzeByCoordinateIntervento
    {
        private readonly IHttpRequestManager<List<SedeUC>> _serviceDirezioni;
        private readonly IHttpRequestManager<DistaccamentoUC> _serviceSedi;
        private readonly IConfiguration _config;
        private readonly IMemoryCache _memoryCache;

        public GetSedi(IHttpRequestManager<List<SedeUC>> serviceDirezioni,
                       IHttpRequestManager<DistaccamentoUC> serviceSedi,
                       IConfiguration config,
                       IMemoryCache memoryCache)
        {
            _serviceDirezioni = serviceDirezioni;
            _serviceSedi = serviceSedi;
            _config = config;
            _memoryCache = memoryCache;
        }

        public async Task<List<SedeUC>> GetDirezioniProvinciali(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetComandiProvinciali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediProvinciali = await _serviceDirezioni.GetAsync(url);

            return lstSediProvinciali;
        }

        public async Task<List<SedeUC>> GetDirezioniRegionali(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetDirezioniRegionali" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstSediRegionali = await _serviceDirezioni.GetAsync(url);

            return lstSediRegionali;
        }

        public async Task<List<SedeUC>> GetFigli(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetChildSede" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstFigli = await _serviceDirezioni.GetAsync(url);

            return lstFigli;
        }

        public async Task<DistaccamentoUC> GetInfoSede(string codSede)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

            _serviceSedi.SetCache(url.AbsoluteUri);

            var sede = _serviceSedi.GetAsync(url).Result;

            return sede;
        }

        public async Task<List<Sede>> GetAll()
        {
            var result = new List<Sede>();

            var lstSedi = ListaSediAlberata();

            result.AddRange(lstSedi.Result.Figli.Select(f => new Sede()
            {
                Codice = f.Codice,
                Descrizione = f.Nome,
                Coordinate = f.Coordinate,
                Indirizzo = null
            }));

            result.AddRange(lstSedi.Result.Figli.First().Figli.Select(f => new Sede()
            {
                Codice = f.Codice,
                Descrizione = f.Nome,
                Coordinate = f.Coordinate,
                Indirizzo = null
            }));

            result.AddRange(lstSedi.Result.Figli.First().Figli.ToList().SelectMany(f => f.Figli.Select(ff => new Sede()
            {
                Codice = ff.Codice,
                Descrizione = ff.Nome,
                Coordinate = ff.Coordinate,
                Indirizzo = null
            })));

            result.AddRange(lstSedi.Result.Figli.First().Figli.ToList().SelectMany(f => f.Figli.SelectMany(ff => ff.Figli.Select(fff => new Sede()
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
            var ListaSediAlberate = new UnitaOperativa("00", "00", new Coordinate());

            if (!_memoryCache.TryGetValue("ListaSediAlberate", out ListaSediAlberate))
            {
                //OTTENGO TUTTE LE SEDI, PER OGNI LIVELLO

                var lstRegionali = GetDirezioniRegionali();

                var lstProvinciali = GetDirezioniProvinciali();

                var lstFigli = Task.Run(() => lstProvinciali.Result.SelectMany(provinciale => GetFigli(provinciale.id).Result).ToList());

                var con = GetInfoSede("00");

                var conFiglio = GetInfoSede("001");

                //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
                var result = new UnitaOperativa(con.Result.Id, con.Result.Descrizione);

                try
                {
                    result.AddFiglio(new UnitaOperativa(conFiglio.Result.Id, conFiglio.Result.Descrizione));

                    //REGIONI
                    Parallel.ForEach(lstRegionali.Result, regionale =>
                    {
                        var info = GetInfoSede(regionale.id);

                        result.Figli.First().AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione, info.Result.Coordinate));
                    });

                    //PROVINCE
                    Parallel.ForEach(lstProvinciali.Result, provinciale =>
                    {
                        var info = GetInfoSede(provinciale.id);

                        var lstComunali = GetFigli(provinciale.id).Result
                            .Select(comunale => new UnitaOperativa(comunale.id, comunale.descrizione, comunale.Coordinate)).ToHashSet().ToList();

                        var centrale = lstComunali.FirstOrDefault(c => c.Nome.ToLower().Contains("centrale") || c.Codice.Split('.')[1].Equals("1000"));
                        
                        if (centrale != null)
                        {
                            lstComunali.Remove(centrale);

                            var unitaComunali = new UnitaOperativa(centrale.Codice, provinciale.descrizione, info.Result.Coordinate);
                            lstComunali.ForEach(c => unitaComunali.AddFiglio(c));

                            result.Figli.First().Figli.FirstOrDefault(r => r.Codice?.Equals(info.Result.IdSedePadre) ?? false)?
                                .AddFiglio(unitaComunali);
                        }
                    });
                }
                catch (Exception e)
                {
                    throw new Exception("Errore costruzione alberatura sedi di servizio.");
                }

                ListaSediAlberate = result;
                var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(10));
                _memoryCache.Set("ListaSediAlberate", ListaSediAlberate, cacheEntryOptions);

                return result;
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
            return new Coordinate(41.89996, 12.49104);
        }

        public string[] GetCompetenzeByCoordinateIntervento(Coordinate coordinate)
        {
            return new string[] { "RM.1000", "RM.1001", "RM.1004" };
        }
    }
}
