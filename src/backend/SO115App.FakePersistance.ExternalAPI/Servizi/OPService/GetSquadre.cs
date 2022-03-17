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

        private readonly IHttpRequestManager<WorkShift> _service;
        private readonly IConfiguration _config;

        public GetSquadre(IHttpRequestManager<WorkShift> service,
            IConfiguration config,
            IGetComposizioneSquadreDB get,
            ISetComposizioneSquadre set)
        {
            _service = service;
            _config = config;
            _set = set;
            _get = get;
        }

        /// <summary>
        ///   SE TORNA 204 VA BENE, IL SERVIZIO FUNZIONA, MA NON TONRA NULLA.
        /// </summary>
        /// <param name="Codice"></param>
        /// <returns></returns>
        public async Task<WorkShift> GetAllByCodiceDistaccamento(string Codice)
        {
            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("OPService").Value + "asdasd");
            var url = new Uri(baseurl, "api/v1/so-workshif/" + "?id_sede=" + Codice);

            try
            {
                //_service.SetCache("Squadre_" + Codice);

                var result = await _service.GetAsync(url);

                if(result == null)
                {
                    result = GetFromDB(Codice);
                }
                else
                {
                    _set.Set(result);
                }

                return result;
            }
            catch (Exception e)
            {
                return GetFromDB(Codice);
            }
        }

        private WorkShift GetFromDB(string codiceDistaccamento)
        {
            var work = _get.Get();

            work.Attuale.Squadre = work.Attuale.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();
            work.Precedente.Squadre = work.Precedente.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();
            work.Successivo.Squadre = work.Successivo.Squadre.Where(s => s.Distaccamento.Contains(codiceDistaccamento)).ToArray();

            return work;
        }
    }
}
