using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using System;
using System.Linq;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AggiornaRichiestaSoccorsoAereo : BaseService, IAggiornaRichiestaSoccorsoAereo
    {
        public AggiornaRichiestaSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor accessor)
        : base(client, configuration, cache, log, accessor) { }

        public void Aggiorna(NuovaRichiestaSoccorsoAereo richiesta)
        {
            var APImanager = new HttpRequestManager<ErroreRichiestaSoccorsoAereo>(_client, _memoryCache, _writeLog, _httpContext, _configuration);

            APImanager.Configure();

            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            var result = APImanager.PutAsync(new Uri(Costanti.AFM + "rescueRequest"), content, "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            if (result != null && result.errors.Count > 0)
                throw new Exception(string.Concat(result.errors.Select(c => c.detail).ToList()));
        }
    }
}
