using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetUscitaMezzo : BaseService, ISetUscitaMezzo
    {
        public SetUscitaMezzo(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
            : base(client, configuration, memoryCache) { }


        public void Set(UscitaGAC uscita)
        {
            var requestManager = new HttpRequestManager<UscitaGAC>(_memoryCache, _client);
            requestManager.Configure();

            var content = new StringContent("");
            var uri = new Uri("");
            var result = requestManager.PutAsync(uri, content);
        }
    }
}
