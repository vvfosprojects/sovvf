using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public class BaseExternalApiService/*<OutputData>*/
    {
        protected readonly HttpClient _client;
        protected readonly IConfiguration _configuration;
        protected readonly IMemoryCache _memoryCache;
        //protected readonly HttpRequestManager<OutputData> _httpRequestManager;

        private BaseExternalApiService() { }
        public BaseExternalApiService(HttpClient client, /*HttpRequestManager<OutputData> httpRequestManager,*/ IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            //_httpRequestManager = httpRequestManager;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }
        //public BaseExternalApiService(HttpClient client, IConfiguration configuration)
        //{
        //    _client = client;
        //    //_httpRequestManager = HttpRequestManager;
        //    _configuration = configuration;
        //    _memoryCache = null;
        //}
    }
}
