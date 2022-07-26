using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;

//using Newtonsoft.Json;
using Polly;
using Polly.Caching;
using Polly.Caching.Memory;
using Polly.Retry;
using Polly.Timeout;
using Polly.Wrap;
using Serilog;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GestioneLog;
using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Client
{
    internal sealed class HttpRequestManager<ResponseObject> : IHttpRequestManager<ResponseObject> where ResponseObject : class
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly IWriteLog _writeLog;
        private readonly IHttpContextAccessor _httpContext;

        private AsyncPolicyWrap<HttpResponseMessage> policies;
        private AsyncTimeoutPolicy<HttpResponseMessage> timeoutPolicy;
        private AsyncRetryPolicy<HttpResponseMessage> retryPolicy;

        public HttpRequestManager(HttpClient client, IConfiguration configuration, IMemoryCache memoryCache, IWriteLog writeLog, IHttpContextAccessor httpContext)
        {
            _client = client;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _writeLog = writeLog;
            _httpContext = httpContext;

            Configure();
        }

        public void SetCache(string cacheString)
        {
            var memoryCacheProvider = new MemoryCacheProvider(_memoryCache);
            var cachePolicy = Policy.CacheAsync(memoryCacheProvider.AsyncFor<HttpResponseMessage>(), TimeSpan.FromHours(0.5), c => cacheString);

            policies = Policy.WrapAsync(cachePolicy, retryPolicy, timeoutPolicy);
        }

        public async Task<ResponseObject> GetAsync(Uri url, string token = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO GET ASYNC BEARER {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);
            if (token != null)
                Log.Information($"Token: {token}");

            stopWatch.Start();

            if (token != null)
                _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);
            else
                _client.DefaultRequestHeaders.Authorization = null;

            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE GET ASYNC BEARER {url.AbsoluteUri} --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> GetAsync(Uri url, string username, string password)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO GET ASYNC BASIC {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);
            Log.Information($"Username: {username}");
            Log.Information($"Password: {password}");
            stopWatch.Start();
            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.GetAsync(url));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE GET ASYNC BASIC {url.AbsoluteUri} --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> PostAsync(Uri url, HttpContent content = null, string token = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO POST ASYNC {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);

            if (content != null)
                Log.Information($"CONTENT: {content}");
            else
                Log.Information($"CONTENT: NULL");

            if (token != null)
                Log.Information($"CONTENT: {token}");
            else
                Log.Information($"TOKEN: NULL");

            stopWatch.Start();

            content.Headers.ContentType = getMediaType();

            if (token != null)
                _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);
            else
                _client.DefaultRequestHeaders.Authorization = null;

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content ?? new StringContent("")));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE POST ASYNC {url.AbsoluteUri} --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> PostAsyncFormData(Uri url, HttpContent content = null, string token = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO POST ASYNC FORM DATA {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);

            if (content != null)
                Log.Information($"CONTENT: {content}");
            else
                Log.Information($"CONTENT: NULL");

            if (token != null)
                Log.Information($"CONTENT: {token}");
            else
                Log.Information($"TOKEN: NULL");

            stopWatch.Start();

            if (token != null)
                _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);
            else
                _client.DefaultRequestHeaders.Authorization = null;

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE POST ASYNC FORM DATA {url.AbsoluteUri}  --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> PostAsync(Uri url, string username, string password, HttpContent content = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO POST ASYNC {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);

            if (content != null)
                Log.Information($"CONTENT: {content}");
            else
                Log.Information($"CONTENT: NULL");

            stopWatch.Start();

            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.PostAsync(url, content ?? new StringContent("")));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE POST ASYNC FORM DATA {url.AbsoluteUri}  --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> PutAsync(Uri url, HttpContent content = null, string token = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO POST ASYNC {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);

            if (content != null)
                Log.Information($"CONTENT: {content}");
            else
                Log.Information($"CONTENT: NULL");

            if (token != null)
                Log.Information($"CONTENT: {token}");
            else
                Log.Information($"TOKEN: NULL");

            stopWatch.Start();

            content.Headers.ContentType = getMediaType();

            if (token != null)
                _client.DefaultRequestHeaders.Authorization = getBearerAuthorization(token);

            var response = await policies.ExecuteAsync(() => _client.PutAsync(url, content ?? new StringContent("")));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE POST ASYNC FORM DATA {url.AbsoluteUri}  --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        public async Task<ResponseObject> PutAsync(Uri url, string username, string password, HttpContent content = null)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"--------------------------- INIZIO POST ASYNC {url.AbsoluteUri} --------------------------- {DateTime.Now}");
            Log.Information(url.AbsoluteUri);

            if (content != null)
                Log.Information($"CONTENT: {content}");
            else
                Log.Information($"CONTENT: NULL");

            content.Headers.ContentType = getMediaType();

            _client.DefaultRequestHeaders.Authorization = getBasicAuthorization(username, password);

            var response = await policies.ExecuteAsync(() => _client.PutAsync(url, content ?? new StringContent("")));

            stopWatch.Stop();

            Log.Information($"--------------------------- FINE POST ASYNC FORM DATA {url.AbsoluteUri}  --------------------------- Elapsed Time {stopWatch.ElapsedMilliseconds}");

            return manageResponse(response, url);
        }

        //PRIVATE METHODS

        private ResponseObject manageResponse(HttpResponseMessage response, Uri url)
        {
            var data = response.Content.ReadAsStringAsync().Result;

            var options = new JsonSerializerOptions();

            options.IgnoreNullValues = true;

            try
            {
                var result = JsonSerializer.Deserialize<ResponseObject>(data, options);

                //#if (DEBUG)
                //Console.WriteLine($"({DateTime.Now}) HTTP_CLIENT - {response.StatusCode}: {response.RequestMessage.RequestUri.AbsoluteUri}");
                //#endif

                return result;


                Log.Information(data);
            }
            catch (Exception e)
            {
                Log.Information("--------- ERRORE: " + url);

                return null;
            }
        }

        private AuthenticationHeaderValue getBearerAuthorization(string token)
        {
            return new AuthenticationHeaderValue("Bearer", "=" + token);
        }

        private AuthenticationHeaderValue getBasicAuthorization(string username, string password)
        {
            return new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));
        }

        private MediaTypeWithQualityHeaderValue getMediaType()
        {
            return new MediaTypeWithQualityHeaderValue("application/json");
        }

        private void Configure()
        {
            //TIMEOUT
            timeoutPolicy = Policy.TimeoutAsync<HttpResponseMessage>(3);

            //ECCEZIONI E RESPONSE
            retryPolicy = Policy.HandleResult<HttpResponseMessage>(c =>
            {
                if (c.StatusCode != HttpStatusCode.OK)
                {
                    var exception = new ExternalApiLog()
                    {
                        Content = c.RequestMessage.Method.Method.Equals("GET") ? c.RequestMessage.RequestUri.Query : c.RequestMessage.Content.ReadAsStringAsync().Result,
                        DataOraEsecuzione = DateTime.UtcNow,
                        Response = string.IsNullOrEmpty(c.Content.ReadAsStringAsync().Result) ? c.StatusCode.ToString() : c.Content.ReadAsStringAsync().Result,
                        Servizio = c.RequestMessage.RequestUri.Host + c.RequestMessage.RequestUri.LocalPath,
                        CodComando = _httpContext.HttpContext.Request.Headers["codiceSede"],
                        IdOperatore = _httpContext.HttpContext.Request.Headers["IdUtente"]
                    };

                    switch (c.StatusCode)
                    {
                        case HttpStatusCode.NotFound:
                            _writeLog.Save(exception); throw new Exception(Messages.ServizioNonRaggiungibile);
                        case HttpStatusCode.Forbidden:
                            _writeLog.Save(exception); throw new Exception(Messages.AutorizzazioneNegata);
                        case HttpStatusCode.UnprocessableEntity:
                            _writeLog.Save(exception); throw new Exception(Messages.DatiMancanti);
                        case HttpStatusCode.InternalServerError:
                            _writeLog.Save(exception); throw new Exception(Messages.ErroreInternoAlServer);
                        case HttpStatusCode.Created:
                            _writeLog.Save(exception); throw new Exception(Messages.NonTuttiIDatiInviatiSonoStatiProcessati);
                        case HttpStatusCode.UnsupportedMediaType:
                            _writeLog.Save(exception); throw new Exception(Messages.OggettoNonValido);

                        case 0:
                            _writeLog.Save(exception); throw new Exception(c.ReasonPhrase);
                    }
                }

                return false;
            }).RetryAsync(0);

            policies = Policy.WrapAsync(retryPolicy, timeoutPolicy);
        }
    }
}
