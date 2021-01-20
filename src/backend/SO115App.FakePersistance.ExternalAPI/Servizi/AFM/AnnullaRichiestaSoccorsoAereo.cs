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
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.AFM
{
    public class AnnullaRichiestaSoccorsoAereo : BaseService, IAnnullaRichiestaSoccorsoAereo
    {
        public AnnullaRichiestaSoccorsoAereo(HttpClient client, IConfiguration configuration, IMemoryCache cache, IWriteLog log, IHttpContextAccessor accessor)
        : base(client, configuration, cache, log, accessor) { }

        public ResponseAFM Annulla(Models.Classi.ServiziEsterni.AFM.AnnullaRichiestaSoccorsoAereo richiesta, string CodiceRichiesta)
        {
            var APImanager = new HttpRequestManager<ResponseAFM>(_client, _memoryCache, _writeLog, _httpContext, _configuration);

            APImanager.Configure();

            var jsonString = JsonConvert.SerializeObject(richiesta);
            var content = new StringContent(jsonString);

            var result = APImanager.PostAsync(new Uri(Costanti.AFM + "rescueRequest/" + CodiceRichiesta + "/abort"), content, "francesco.dangelis@dipvvf.it", "DNGFNC98R17D662Q").Result;

            return result;
        }
    }
}
