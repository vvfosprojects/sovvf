using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Squadra = SO115App.Models.Classi.ServiziEsterni.OPService.SquadraOpService;

namespace SO115App.ExternalAPI.Fake.Servizi.OPService
{
    public class GetAllSquadre : IGetAllSquadre
    {
        private readonly IHttpRequestManager<WorkShift> _service;
        private readonly IConfiguration _config;
        private readonly IGetStatoSquadra _getStatoSquadre;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;
        private readonly IGetListaDistaccamentiByPinListaSedi _getDistaccamenti;
        private readonly IMemoryCache _memoryCache;

        public GetAllSquadre(IHttpRequestManager<WorkShift> service,
            IConfiguration config, IGetStatoSquadra getStatoSquadre,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetListaDistaccamentiByPinListaSedi getDistaccamenti,
            IMemoryCache memoryCache)
        {
            _service = service;
            _config = config;
            _getStatoSquadre = getStatoSquadre;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
            _getDistaccamenti = getDistaccamenti;
            _memoryCache = memoryCache;
        }

        public async Task<List<ComposizioneSquadra>> GetByCodiceSede(string[] CodiciSede)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value);
            var cacheEntryOptions = new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(8));

            List<ComposizioneSquadra> lstSquadre = new List<ComposizioneSquadra>();
            List<ComposizioneSquadra> lstSquadreAppo = new List<ComposizioneSquadra>();

            foreach (string codice in CodiciSede)
            {
                if (!_memoryCache.TryGetValue("listaSquadre-" + codice, out lstSquadreAppo))
                {
                    var url = new Uri(baseurl, "api/v1/so-workshift/" + "?id_sede=" + codice.Split('.')[0]);
                    var result = await _service.GetAsync(url);

                    if (result != null)
                    {
                        lstSquadreAppo.AddRange(MappaOPSquadreSuSOSquadre(result, codice).Result);
                        _memoryCache.Set("listaSquadre-" + codice, lstSquadreAppo, cacheEntryOptions);
                    }
                }
                else
                {
                    lstSquadre.AddRange(lstSquadreAppo);
                }
            }

            return lstSquadre;
        }

        private async Task<List<ComposizioneSquadra>> MappaOPSquadreSuSOSquadre(WorkShift lstOPSquadre, string codice)
        {
            List<string> listaSedi = new List<string>();
            listaSedi.Add(codice);

            var lstSquadre = new ConcurrentBag<ComposizioneSquadra>();
            var lstDistaccamenti = await Task.Run(() =>
            {
                var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
                var pinNodi = new List<PinNodo>();
                foreach (var sede in listaSedi)
                    pinNodi.Add(new PinNodo(sede, true));

                foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                    pinNodi.Add(new PinNodo(figlio.Codice, true));

                var result = _getDistaccamenti.GetListaDistaccamenti(pinNodi.ToHashSet().ToList());

                return result;
            });

            Parallel.ForEach(lstOPSquadre.Squadre.ToList().FindAll(x => lstDistaccamenti.FindAll(d => d.Id.Contains(x.Distaccamento)).Count > 0 && x.spotType.Equals("WORKSHIFT")), squadra =>
                 lstSquadre.Add(new ComposizioneSquadra()
                 {
                     IdSquadra = squadra.spotId,
                     Codice = squadra.Codice,
                     Turno = squadra.TurnoAttuale.ToCharArray()[0],
                     Nome = squadra.Descrizione,
                     Distaccamento = new DistaccamentoComposizione()
                     {
                         Codice = squadra.Distaccamento
                     }
                 }
                 ));

            return lstSquadre.ToList();
        }
    }
}
