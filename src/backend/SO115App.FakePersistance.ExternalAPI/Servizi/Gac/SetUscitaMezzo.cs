using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetUscitaMezzo : ISetUscitaMezzo
    {
        private readonly IGetToken _getToken;
        private readonly IHttpRequestManager<List<Response>> _client;
        private readonly IConfiguration _configuration;
        public SetUscitaMezzo(IHttpRequestManager<List<Response>> client, IGetToken getToken, IConfiguration configuration)
        {
            _getToken = getToken;
            _configuration = configuration;
            _client = client;
        }

        public void Set(UscitaGAC uscita)
        {
            var lstUscite = new List<UscitaGAC>() { uscita };

            _client.Configure();

            var jsonString = JsonConvert.SerializeObject(lstUscite);
            var content = new StringContent(jsonString);
            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacUscitaMezzo);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;
        }
    }
}
