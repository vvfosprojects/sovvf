using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetToken : BaseService
    {
        public GetToken(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
            : base(client, configuration, memoryCache, writeLog, httpContext)
        { }

        public string GeneraToken()
        {
            string token = "";

            var httpManagerToken = new HttpRequestManager<TokenService>(_client, _memoryCache, _writeLog, _httpContext, _configuration);
            httpManagerToken.Configure();

            var url = new Uri($"{_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value}{Costanti.GacGetToken}?user=SO115&password=SO115");
            var EsitoToken = httpManagerToken.GetAsync(url, token).Result;

            if (!EsitoToken.errore)
                token = EsitoToken.descrizioneEsito;

            return token;
        }
    }
}
