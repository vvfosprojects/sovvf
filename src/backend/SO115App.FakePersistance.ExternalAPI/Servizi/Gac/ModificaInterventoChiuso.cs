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
    public class ModificaInterventoChiuso : IModificaInterventoChiuso
    {
        private readonly IHttpRequestManager<List<ModificaMovimentoResponse>> _client;
        private readonly IGetToken _getToken;
        private readonly IConfiguration _configuration;

        public ModificaInterventoChiuso(IHttpRequestManager<List<ModificaMovimentoResponse>> client, IGetToken getToken, IConfiguration configuration)
        {
            _client = client;
            _getToken = getToken;
            _configuration = configuration;
        }

        public void Send(ModificaMovimentoGAC modificamovimento)
        {
            var jsonString = JsonConvert.SerializeObject(modificamovimento);
            var content = new StringContent(jsonString);

            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.ModificaMovimento);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;
        }
    }
}
