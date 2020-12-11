using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Wrap;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public class HttpRequestManager<ResponseObject> : IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        private readonly HttpClient _client;
        private readonly IMemoryCache _memoryCache;
        private readonly IWriteLog _writeLog;
        private readonly IHttpContextAccessor _httpContext;
        private readonly IConfiguration _configuration;

        private HttpRequestManager()
        {
        }

        public HttpRequestManager(HttpClient client, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext, IConfiguration configuration)
        {
            _client = client;
            _memoryCache = memoryCache;
            _writeLog = writeLog;
            _httpContext = httpContext;
            _configuration = configuration;
        }

        private AsyncPolicyWrap<HttpResponseMessage> policies;

        public void Configure(string cacheString = null)
        {
            //TIMEOUT
            var timeoutPolicy = Policy
                .TimeoutAsync<HttpResponseMessage>(60);

            //ECCEZIONI E RESPONSE
            var retryPolicy = Policy
                .HandleResult<HttpResponseMessage>(c =>
                {
                    if (c.StatusCode != HttpStatusCode.OK)
                    {
                        var exception = new ExternalApiLog()
                        {
                            Content = c.RequestMessage.Method.Method.Equals("GET") ? c.RequestMessage.RequestUri.Query : c.RequestMessage.Content.ReadAsStringAsync().Result,
                            DataOraEsecuzione = DateTime.Now,
                            Response = string.IsNullOrEmpty(c.Content.ReadAsStringAsync().Result) ? c.ReasonPhrase : c.Content.ReadAsStringAsync().Result,
                            Servizio = c.RequestMessage.RequestUri.Host + c.RequestMessage.RequestUri.LocalPath,
                            CodComando = _httpContext.HttpContext.Request.Headers["codiceSede"],
                            IdOperatore = _httpContext.HttpContext.Request.Headers["IdUtente"]
                        };

                        _writeLog.Save(exception);

                        switch (c.StatusCode)
                        {
                            case HttpStatusCode.NotFound:
                                throw new Exception(Costanti.ES.ServizioNonRaggiungibile);
                            case HttpStatusCode.Forbidden:
                                throw new Exception(Costanti.ES.AutorizzazioneNegata);
                            case HttpStatusCode.UnprocessableEntity:
                                throw new Exception(Costanti.ES.DatiMancanti);
                            case HttpStatusCode.InternalServerError:
                                throw new Exception(Costanti.ES.ErroreInternoAlServer);
                            case HttpStatusCode.Created:
                                throw new Exception(Costanti.ES.NonTuttiIDatiInviatiSonoStatiProcessati);
                            case HttpStatusCode.UnsupportedMediaType:
                                throw new Exception(Costanti.ES.OggettoNonValido);
                            case 0:
                                throw new Exception(c.ReasonPhrase);
                        }
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

        public async Task<ResponseObject> GetAsync(Uri url, string token)
        {
            _client.DefaultRequestHeaders.Authorization =
                   new AuthenticationHeaderValue("Bearer", "=" + token);

            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            return ManageResponse(response);
        }

        public async Task<ResponseObject> PostAsync(Uri url, HttpContent content, string token)
        {
            content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");

            _client.DefaultRequestHeaders.Authorization =
                   new AuthenticationHeaderValue("Bearer", "=" + token);

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return ManageResponse(response);
        }

        public async Task<ResponseObject> PutAsync(Uri url, HttpContent content, string token)
        {
            content.Headers.ContentType = new MediaTypeWithQualityHeaderValue("application/json");

            _client.DefaultRequestHeaders.Authorization =
                   new AuthenticationHeaderValue("Bearer", "=" + token);

            var response = await policies.ExecuteAsync(() => _client.PutAsync(url, content));

            return ManageResponse(response);
        }

        private ResponseObject ManageResponse(HttpResponseMessage response)
        {
            var data = response.Content.ReadAsStringAsync().Result;

            return JsonConvert.DeserializeObject<ResponseObject>(data);
        }
    }
}
