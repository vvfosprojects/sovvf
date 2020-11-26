using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetUscitaMezzo : BaseService, ISetUscitaMezzo
    {
        public SetUscitaMezzo(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
            : base(client, configuration, memoryCache, writeLog, httpContext) { }


        public void Set(UscitaGAC uscita)
        {
            var lstUscite = new List<UscitaGAC>() { uscita };

            var requestManager = new HttpRequestManager<object>(_client, _memoryCache, _writeLog, _httpContext);
            requestManager.Configure();

            var jsonString = JsonConvert.SerializeObject(lstUscite);
            var content = new StringContent(jsonString);
            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacUscitaMezzo);

            var result = requestManager.PutAsync(uri, content).Result;
        }
    }
}
