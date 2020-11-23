using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public abstract class BaseService
    {
        protected readonly HttpClient _client;
        protected readonly IConfiguration _configuration;
        protected readonly IMemoryCache _memoryCache;

        private BaseService() { }
        public BaseService(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
        }
    }
}
