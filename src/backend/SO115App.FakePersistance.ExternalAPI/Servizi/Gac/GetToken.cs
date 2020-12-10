using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Fake.HttpManager;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class GetToken : BaseService
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly IWriteLog _writeLog;
        private readonly IHttpContextAccessor _httpContext;

        public GetToken(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext) : base(client, configuration, memoryCache, writeLog, httpContext)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _writeLog = writeLog;
            _httpContext = httpContext;
        }

        public string GeneraToken()
        {
            string token = "";
            var httpManagerToken = new HttpRequestManager<TokenService>(_client, _memoryCache, _writeLog, _httpContext, _configuration);
            httpManagerToken.Configure();

            var EsitoToken = httpManagerToken.RichiediToken().Result;

            if (!EsitoToken.errore)
                token = EsitoToken.descrizioneEsito;

            return token;
        }
    }
}
