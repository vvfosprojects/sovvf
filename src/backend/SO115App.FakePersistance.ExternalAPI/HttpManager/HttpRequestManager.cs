using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Wrap;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public class HttpRequestManager<OutputData> : IHttpRequestManager<OutputData>
    {
        private readonly IMemoryCache _memoryCache;
        private readonly HttpClient _client;

        private AsyncPolicyWrap<HttpResponseMessage> policies;

        public HttpRequestManager(IMemoryCache memoryCache, HttpClient client)
        {
            _client = client;
            _memoryCache = memoryCache;
        }

        public void Configure(string cacheString = null)
        {
            //TIMEOUT
            var timeoutPolicy = Policy
                .TimeoutAsync<HttpResponseMessage>(120);

            //ECCEZIONI E RESPONSE
            var retryPolicy = Policy
                .Handle<AggregateException>(e => throw new Exception("Servizio non raggiungibile"))
                .OrResult<HttpResponseMessage>(c =>
                {
                    switch(c.StatusCode)
                    {
                        case HttpStatusCode.NotFound:
                            throw new Exception("Servizio non raggiungibile");
                    }

                    return false;
                })
                .RetryAsync(3);

            //CACHE
            if (!string.IsNullOrEmpty(cacheString))
            {
                var memoryCacheProvider = new MemoryCacheProvider(_memoryCache);
                var cachePolicy = Policy.CacheAsync(memoryCacheProvider.AsyncFor<HttpResponseMessage>(), TimeSpan.FromHours(8), c => cacheString);

                policies = Policy.WrapAsync(cachePolicy, retryPolicy, timeoutPolicy);
            }
            else
                policies = Policy.WrapAsync(retryPolicy, timeoutPolicy);
        }

        public async Task<OutputData> GetAsync(Uri url)
        {
            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            return ManageResponse(response);
        }

        public async Task<OutputData> PostAsync(Uri url, HttpContent content)
        {
            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return ManageResponse(response);
        }

        public async Task<OutputData> PutAsync(Uri url, HttpContent content)
        {
            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return ManageResponse(response);
        }

        private OutputData ManageResponse(HttpResponseMessage response)
        {
            var data = response.Content.ReadAsStringAsync().Result;

            return JsonConvert.DeserializeObject<OutputData>(data);
        }
    }
}
