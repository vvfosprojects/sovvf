using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetTipologieSoccorsoAereo : BaseService, IGetTipologieRichiestaSoccorsoAereo
    {
        public GetTipologieSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor httpContext)
            : base(client, configuration, cache, log, httpContext) { }

        public List<TipologiaAFM> Get()
        {
            var APImanager = new HttpRequestManager<List<TipologiaAFM>>(_client, _memoryCache, _writeLog, _httpContext, _configuration);

            APImanager.Configure();

            var result = APImanager.GetAsync(new Uri(Costanti.AFM + "requestType"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
