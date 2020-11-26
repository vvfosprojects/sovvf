using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Wrap;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.HttpManager
{
    public class HttpRequestManager<ResponseObject> : IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        private readonly IMemoryCache _memoryCache;
        private readonly HttpClient _client;
        private readonly IWriteLog _writeLog;
        private AsyncPolicyWrap<HttpResponseMessage> policies;

        public HttpRequestManager(IMemoryCache memoryCache, HttpClient client, IWriteLog writeLog)
        {
            _client = client;
            _writeLog = writeLog;
            _memoryCache = memoryCache;
        }

        public void Configure(string cacheString = null)
        {
            //TIMEOUT
            var timeoutPolicy = Policy
                .TimeoutAsync<HttpResponseMessage>(60);

            //ECCEZIONI E RESPONSE
            var retryPolicy = Policy
                //.Handle<AggregateException>(e => 
                //throw new Exception(Costanti.ES.ServizioNonRaggiungibile))
                .HandleResult<HttpResponseMessage>(c =>
                {
                    if (c.StatusCode != HttpStatusCode.OK)
                    {
                        var exception = new LogException()
                        {
                            Content = c.RequestMessage.Method.Method.Equals("GET") ? c.RequestMessage.RequestUri.Query : c.RequestMessage.Content.ReadAsStringAsync().Result,
                            DataOraEsecuzione = DateTime.Now,
                            Response = c.Content.ReadAsStringAsync().Result,
                            Servizio = c.RequestMessage.RequestUri.Host + c.RequestMessage.RequestUri.LocalPath
                            //CodComando = c.RequestMessage. //TODO trovare nel content o nella querystring
                        };

                        _writeLog.Save(exception);

                        switch (c.StatusCode)
                        {
                            case HttpStatusCode.NotFound:
                            {
                                exception.Response = c.ReasonPhrase;
                                throw new Exception(Costanti.ES.ServizioNonRaggiungibile);
                            }
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

        public async Task<ResponseObject> GetAsync(Uri url)
        {
            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            return ManageResponse(response);
        }

        public async Task<ResponseObject> PostAsync(Uri url, HttpContent content)
        {
            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return ManageResponse(response);
        }

        public async Task<ResponseObject> PutAsync(Uri url, HttpContent content)
        {
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
