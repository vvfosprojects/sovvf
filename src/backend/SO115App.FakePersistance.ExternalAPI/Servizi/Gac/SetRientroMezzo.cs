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
    public class SetRientroMezzo : BaseService, ISetRientroMezzo
    {
        public SetRientroMezzo(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
            : base(client, configuration, memoryCache, writeLog, httpContext) { }

        public void Set(RientroGAC rientro)
        {
            GetToken getToken = new GetToken(_client, _configuration, _memoryCache, _writeLog, _httpContext);

            var lstRientri = new List<RientroGAC>() { rientro };

            var requestManager = new HttpRequestManager<object>(_client, _memoryCache, _writeLog, _httpContext, _configuration);
            requestManager.Configure();

            var jsonString = JsonConvert.SerializeObject(lstRientri);
            var content = new StringContent(jsonString);
            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacRientroMezzo);

            var result = requestManager.PutAsync(uri, content, getToken.GeneraToken()).Result;
        }
    }
}
