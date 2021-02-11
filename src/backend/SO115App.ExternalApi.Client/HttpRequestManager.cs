﻿using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Retry;
using Polly.Timeout;
using Polly.Wrap;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Client
{
    internal sealed class HttpRequestManager<ResponseObject> : BaseService, IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        private AsyncPolicyWrap<HttpResponseMessage> policies;
        private AsyncTimeoutPolicy<HttpResponseMessage> timeoutPolicy;
        private AsyncRetryPolicy<HttpResponseMessage> retryPolicy;

        public HttpRequestManager(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
            : base(client, configuration, memoryCache, writeLog, httpContext)
        {
            Configure();
        }

        public void SetCache(string cacheString)
        {
            var memoryCacheProvider = new MemoryCacheProvider(_memoryCache);
            var cachePolicy = Policy.CacheAsync(memoryCacheProvider.AsyncFor<HttpResponseMessage>(), TimeSpan.FromHours(1), c => cacheString);

            policies = Policy.WrapAsync(cachePolicy, retryPolicy, timeoutPolicy);
        }

        public async Task<ResponseObject> GetAsync(Uri url, string token)
        {
            _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);

            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            return manageResponse(response);
        }

        public async Task<ResponseObject> GetAsync(Uri url, string username, string password)
        {
            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            return manageResponse(response);
        }

        public async Task<ResponseObject> PostAsync(Uri url, HttpContent content, string token)
        {
            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return manageResponse(response);
        }

        public async Task<ResponseObject> PostAsync(Uri url, HttpContent content, string username, string password)
        {
            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            return manageResponse(response);
        }

        public async Task<ResponseObject> PutAsync(Uri url, HttpContent content, string token)
        {
            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);

            var response = await policies.ExecuteAsync(() => _client.PutAsync(url, content));

            return manageResponse(response);
        }

        public async Task<ResponseObject> PutAsync(Uri url, HttpContent content, string username, string password)
        {
            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.PutAsync(url, content));

            return manageResponse(response);
        }


        //PRIVATE METHODS

        ResponseObject manageResponse(HttpResponseMessage response)
        {
            var data = response.Content.ReadAsStringAsync().Result;

            return JsonConvert.DeserializeObject<ResponseObject>(data);
        }

        AuthenticationHeaderValue getBearerAuthorization(string token)
        {
            return new AuthenticationHeaderValue("Bearer", "=" + token);
        }

        AuthenticationHeaderValue getBasicAuthorization(string username, string password)
        {
            return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"{username}:{password}")));
        }

        MediaTypeWithQualityHeaderValue getMediaType()
        {
            return new MediaTypeWithQualityHeaderValue("application/json");
        }

        private void Configure()
        {
            //TIMEOUT
            timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(60);

            //ECCEZIONI E RESPONSE
            retryPolicy = Policy.HandleResult<HttpResponseMessage>(c =>
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
                        case HttpStatusCode.NotFound: throw new Exception(Messages.ServizioNonRaggiungibile);
                        case HttpStatusCode.Forbidden: throw new Exception(Messages.AutorizzazioneNegata);
                        case HttpStatusCode.UnprocessableEntity: throw new Exception(Messages.DatiMancanti);
                        case HttpStatusCode.InternalServerError: throw new Exception(Messages.ErroreInternoAlServer);
                        case HttpStatusCode.Created: throw new Exception(Messages.NonTuttiIDatiInviatiSonoStatiProcessati);
                        case HttpStatusCode.UnsupportedMediaType: throw new Exception(Messages.OggettoNonValido);
                        case 0: throw new Exception(c.ReasonPhrase);
                    }
                }

                return false;
            }).RetryAsync(3);

            policies = Policy.WrapAsync(retryPolicy, timeoutPolicy);
        }
    }
}
