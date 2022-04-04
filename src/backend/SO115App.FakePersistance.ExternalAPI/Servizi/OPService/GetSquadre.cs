using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetSquadre : IGetSquadre
    {
        private readonly IGetComposizioneSquadreDB _get;
        private readonly ISetComposizioneSquadre _set;
        private readonly IMemoryCache _memoryCache;
        private readonly IHttpRequestManager<WorkShift> _service;
        private readonly IConfiguration _config;

        public GetSquadre(IHttpRequestManager<WorkShift> service,
            IConfiguration config,
            IGetComposizioneSquadreDB get,
            ISetComposizioneSquadre set,
            IMemoryCache memoryCache)
        {
            _service = service;
            _config = config;
            _set = set;
            _memoryCache = memoryCache;
            _get = get;
        }

        /// <summary>
        ///   SE TORNA 204 VA BENE, IL SERVIZIO FUNZIONA, MA NON TONRA NULLA.
        /// </summary>
        /// <param name="Codice"></param>
        /// <returns></returns>
        public async Task<WorkShift> GetAllByCodiceDistaccamento(string Codice)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);
            var url = new Uri(baseurl, "api/v1/so-workshift/" + "?id_sede=" + Codice);
            var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(2));

            WorkShift result = new WorkShift();

            if (!_memoryCache.TryGetValue("listaSquadre-" + Codice, out result))
            {
                try
                {
                    //_service.SetCache("Squadre_" + Codice);

                    result = await _service.GetAsync(url);

                    if (result == null || result.Squadre.Length <= 0)
                    {
                        result = GetFromDB(Codice);
                    }
                    else
                    {
                        result.Distaccamento = Codice;

                        _memoryCache.Set("listaSquadre-" + Codice, result, cacheEntryOptions);
                        _set.Set(result);
                    }

                    return result;
                }
                catch (Exception e)
                {
                    result = GetFromDB(Codice);

                    if (result != null && result.Squadre.Length > 0)
                        _memoryCache.Set("listaSquadre-" + Codice, result, cacheEntryOptions);

                    return result;
                }
            }
            else
            {
                return result;
            }
        }

        private WorkShift GetFromDB(string codiceDistaccamento)
        {
            var work = _get.GetByCodiceDistaccamento(codiceDistaccamento);

            if (work == null)
                return null;

            work.Attuale.Squadre = work.Attuale.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();
            work.Precedente.Squadre = work.Precedente.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();
            work.Successivo.Squadre = work.Successivo.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();

            return work;
        }
    }
}
