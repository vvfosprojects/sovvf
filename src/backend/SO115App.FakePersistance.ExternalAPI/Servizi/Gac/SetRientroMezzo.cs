using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetRientroMezzo : ISetRientroMezzo
    {
        private readonly IHttpRequestManager<RientroGAC> _client;
        private readonly IGetToken _getToken;
        private readonly IConfiguration _configuration;

        public SetRientroMezzo(IGetToken getToken, IHttpRequestManager<RientroGAC> client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
        {
            _client = client;
            _getToken = getToken;
            _configuration = configuration;
        }

        public void Set(RientroGAC rientro)
        {
            var lstRientri = new List<RientroGAC>() { rientro };

            _client.Configure();

            var jsonString = JsonConvert.SerializeObject(lstRientri);
            var content = new StringContent(jsonString);
            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacRientroMezzo);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;
        }
    }
}
