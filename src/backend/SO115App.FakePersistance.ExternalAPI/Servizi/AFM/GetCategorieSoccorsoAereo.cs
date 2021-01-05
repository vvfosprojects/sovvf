using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class GetCategorieSoccorsoAereo : BaseService, IGetCategorieSoccorsoAereo
    {
        public GetCategorieSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor httpContext)
            : base(client, configuration, cache, log, httpContext) { }

        public List<CategoriaSoccorsoAereo> Get()
        {
            var APImanager = new HttpRequestManager<List<CategoriaSoccorsoAereo>>(_client, _memoryCache, _writeLog, _httpContext, _configuration);

            APImanager.Configure();

            var result = APImanager.GetAsync(new Uri("http://afm-demo.dipvvf.it/webRescue/rescueCategory"), "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }

    }
}
