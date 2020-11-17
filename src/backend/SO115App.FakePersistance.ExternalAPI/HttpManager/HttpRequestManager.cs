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

namespace Prova_Polly2
{
    public class HttpRequestManager<OutputData> : IHttpRequestManager<OutputData>, IDisposable
    {
        private readonly HttpClient _client;
        private AsyncPolicyWrap<HttpResponseMessage> policies;
        private OutputData Result = default;

        private HttpRequestManager() { }
        public HttpRequestManager(HttpClient client, string cacheString = null)
        {
            _client = client;

            var timeoutPolicy = Policy
                .TimeoutAsync<HttpResponseMessage>(120);

            var retryPolicy = Policy
                .Handle<AggregateException>(e => throw new Exception("Servizio non raggiungibile"))
                .OrResult<HttpResponseMessage>(c => c.StatusCode == HttpStatusCode.NotFound)
                .RetryAsync(3);

            if (!string.IsNullOrEmpty(cacheString))
            {
                var memoryCacheProvider = new MemoryCacheProvider(new MemoryCache(new MemoryCacheOptions()));
                var cachePolicy = Policy.CacheAsync(memoryCacheProvider.AsyncFor<HttpResponseMessage>(), TimeSpan.FromHours(6), c =>
                {
                    var msgCache = "Risultato salvato in cache";
                    Console.WriteLine(msgCache);
                    return msgCache;
                });

                policies = Policy.WrapAsync(cachePolicy, retryPolicy, timeoutPolicy);
            }
            else
                policies = Policy.WrapAsync(retryPolicy, timeoutPolicy);
        }

        public async Task<OutputData> ExecuteGet(Uri url)
        {
            await policies.ExecuteAsync(() => Task.Run(() =>
            {
                var response = _client.GetAsync(url).Result;
                var data = response.Content.ReadAsStringAsync().Result;
                Result = JsonConvert.DeserializeObject<OutputData>(data);

                return response;
            }));

            return Result;
        }

        public async Task<OutputData> ExecutePost(Uri url, HttpContent content)
        {
            await policies.ExecuteAsync(() => Task.Run(() =>
            {
                var response = _client.PostAsync(url, content).Result;
                var data = response.Content.ReadAsStringAsync().Result;
                Result = JsonConvert.DeserializeObject<OutputData>(data);

                return response;
            }));

            return Result;
        }

        public async Task<OutputData> ExecutePut(Uri url, HttpContent content)
        {
            await policies.ExecuteAsync(() => Task.Run(() =>
            {
                var response = _client.PutAsync(url, content).Result;
                var data = response.Content.ReadAsStringAsync().Result;
                Result = JsonConvert.DeserializeObject<OutputData>(data);

                return response;
            }));

            return Result;
        }

        public void Dispose()
        {
            _client.Dispose();
        }
    }
}
