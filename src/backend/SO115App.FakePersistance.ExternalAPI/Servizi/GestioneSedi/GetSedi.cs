using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.MongoDTO;
using SO115App.Models.Classi.ServiziEsterni.UtenteComune;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetSedi : IGetDirezioni, IGetSedi, IGetAlberaturaUnitaOperative, IGetListaDistaccamentiByPinListaSedi
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

        public async Task<List<SedeUC>> GetFigliDirezione(string codSede = null)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetChildSede" + "?codSede=" + codSede);

            _serviceDirezioni.SetCache(url.AbsoluteUri);

            var lstFigli = await _serviceDirezioni.GetAsync(url);

            return lstFigli;
        }

        public DistaccamentoUC GetInfoSede(string codSede)
        {
            var baseurl = _config.GetSection("UrlExternalApi").GetValue<string>("InfoSedeApiUtenteComune");
            var url = new Uri(baseurl + "/GetInfoSede" + "?codSede=" + codSede);

            _serviceSedi.SetCache(url.AbsoluteUri);

            var sede = _serviceSedi.GetAsync(url).Result;

            return sede;
        }

        public List<ListaSedi> GetAll()
        {
            var result = new List<ListaSedi>();

            var lstSedi = ListaSediAlberata();

            result.AddRange(lstSedi.Figli.Select(f => new ListaSedi()
            {
                Id = f.Codice,
                sede = f.Nome
            }));

            result.AddRange(lstSedi.Figli.First().Figli.Select(f => new ListaSedi()
            {
                Id = f.Codice,
                sede = f.Nome
            }));

            result.AddRange(lstSedi.Figli.First().Figli.ToList().SelectMany(f => f.Figli.Select(ff => new ListaSedi()
            {
                Id = ff.Codice,
                sede = ff.Nome
            })));

            result.AddRange(lstSedi.Figli.First().Figli.ToList().SelectMany(f => f.Figli.SelectMany(ff => ff.Figli.Select(fff => new ListaSedi()
            {
                Id = fff.Codice,
                sede = fff.Nome
            }))));

            return result.Distinct().ToList();
        }

        public UnitaOperativa ListaSediAlberata()
        {
            UnitaOperativa ListaSediAlberate = new UnitaOperativa("00", "00");

            if (!_memoryCache.TryGetValue("ListaSediAlberate", out ListaSediAlberate))
            {
                //OTTENGO TUTTE LE SEDI, PER OGNI LIVELLO

                var lstRegionali = GetDirezioniRegionali();

                var lstProvinciali = GetDirezioniProvinciali();

                var lstFigli = Task.Run(() => lstProvinciali.Result.SelectMany(provinciale => GetFigliDirezione(provinciale.id).Result).ToList());

                var con = GetInfoSede("00");

                var conFiglio = GetInfoSede("001");

                //CREO L'ALNERATURA DELLE SEDI PARTENDO DAL CON
                var result = new UnitaOperativa(con.Id, con.Descrizione);

                try
                {
                    result.AddFiglio(new UnitaOperativa(conFiglio.Id, conFiglio.Descrizione));

                    //REGIONI
                    foreach (var regionale in lstRegionali.Result)
                    {
                        result.Figli.First().AddFiglio(new UnitaOperativa(regionale.id, regionale.descrizione));
                    }

                    //PROVINCE
                    Parallel.ForEach(lstProvinciali.Result, provinciale =>
                    {
                        var infoProvinciale = GetInfoSede(provinciale.id);

                        var lstComunali = GetFigliDirezione(provinciale.id).Result
                            .Select(comunale => new UnitaOperativa(comunale.id, comunale.descrizione)).ToHashSet().ToList();

                        var centrale = lstComunali.First(c => c.Nome.ToLower().Contains("centrale") || c.Codice.Split('.')[1].Equals("1000"));
                        lstComunali.Remove(centrale);

                        var unitaComunali = new UnitaOperativa(centrale?.Codice, provinciale?.descrizione);
                        lstComunali.ForEach(c => unitaComunali.AddFiglio(c));

                        result.Figli.First().Figli.FirstOrDefault(r => r.Codice?.Equals(infoProvinciale.IdSedePadre) ?? false)?
                            .AddFiglio(unitaComunali);
                    });
                }
                catch (Exception e)
                {
                    return null;
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

        public List<Distaccamento> GetListaDistaccamenti(List<PinNodo> listaPin)
        {
            var lstCodici = listaPin.Select(p => p.Codice).ToList();

            var result = GetAll().Where(s => lstCodici.Any(c => c.ToUpper().Equals(s.Id.ToUpper()))).Select(s => new Distaccamento()
            {
                Id = s.Id,
                CodSede = s.Id,
                DescDistaccamento = s.sede
            }).ToList();

            return result;
        }
    }
}
