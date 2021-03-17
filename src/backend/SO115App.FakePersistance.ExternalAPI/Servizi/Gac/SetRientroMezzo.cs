using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;

#if (!DEBUG)

using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using System.Linq;
using System.Net.Http;
using System;

#endif

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetRientroMezzo : ISetRientroMezzo
    {
        private readonly IHttpRequestManager<List<Response>> _client;
        private readonly IGetToken _getToken;
        private readonly IConfiguration _configuration;

        public SetRientroMezzo(IGetToken getToken, IHttpRequestManager<List<Response>> client, IConfiguration configuration)
        {
            _client = client;
            _getToken = getToken;
            _configuration = configuration;
        }

        public void Set(RientroGAC rientro)
        { 
#if (!DEBUG)

            var lstRientri = new List<RientroGAC>() { rientro };
            var jsonString = JsonConvert.SerializeObject(lstRientri);
            var content = new StringContent(jsonString);

            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacRientroMezzo);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;

            if (result != null && result.TrueForAll(item => item.codiceEsito != "200" && item.codiceEsito != "201"))
            {
                throw new Exception($"Errore servizio rientro GAC: {result.First().codiceEsito}, {result.First().descrizioneEsito}");
            }

#endif
        }
    }
}
