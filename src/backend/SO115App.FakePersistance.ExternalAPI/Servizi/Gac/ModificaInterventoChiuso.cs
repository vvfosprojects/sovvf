using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class ModificaInterventoChiuso : IModificaInterventoChiuso
    {
        private readonly IHttpRequestManager<List<ModificaMovimentoResponse>> _client;
        private readonly IGetToken _getToken;
        private readonly IConfiguration _configuration;
        private readonly IGetDescComuneProvincia _comuneService;

        public ModificaInterventoChiuso(IHttpRequestManager<List<ModificaMovimentoResponse>> client, IGetToken getToken, IConfiguration configuration, IGetDescComuneProvincia comuneService)
        {
            _client = client;
            _getToken = getToken;
            _configuration = configuration;
            _comuneService = comuneService;
        }

        public void Send(ModificaMovimentoGAC modificamovimento)
        {
            //OTTENGO PROVINCIA E COMUNE
            var territorio = _comuneService.GetComuneBy(modificamovimento.comune.descrizione).Result;

            modificamovimento.comune.codice = territorio.First(x => x.descrizione.ToLower().Equals(modificamovimento.comune.descrizione.ToLower())).codice;
            modificamovimento.provincia.codice = territorio.First(x => x.descrizione.ToLower().Equals(modificamovimento.provincia.descrizione.ToLower())).codice;

            //USCITA GAC
            var lstModificheMovimento = new List<ModificaMovimentoGAC>() { modificamovimento };
            var jsonString = JsonConvert.SerializeObject(lstModificheMovimento);
            var content = new StringContent(jsonString);

            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.ModificaMovimento);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;
        }
    }
}
