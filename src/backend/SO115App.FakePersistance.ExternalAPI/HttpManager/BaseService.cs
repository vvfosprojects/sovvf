using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public abstract class BaseService
    {
        protected readonly HttpClient _client;
        protected readonly IConfiguration _configuration;
        protected readonly IMemoryCache _memoryCache;
        protected readonly IWriteLog _writeLog;

        private BaseService() { }
        public BaseService(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _writeLog = writeLog;
        }
    }
}
