using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetInfoRichiestaSoccorsoAereo : BaseService, IGetInfoRichiestaSoccorsoAereo
    {
        public GetInfoRichiestaSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor accessor)
        : base(client, configuration, cache, log, accessor) { }

        public InfoAFM Get(string requestKey)
        {
            var APImanager = new HttpRequestManager<InfoAFM>(_client, _memoryCache, _writeLog, _httpContext, _configuration);

            APImanager.Configure();

            var result = APImanager.GetAsync(new Uri(Costanti.AFM + "rescueRequest/" + requestKey + "/"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
