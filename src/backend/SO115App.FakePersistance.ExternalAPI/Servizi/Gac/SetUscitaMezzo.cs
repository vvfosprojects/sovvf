using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using System.Collections.Generic;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using System;
using System.Linq;
using System.Net.Http;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetUscitaMezzo : ISetUscitaMezzo
    {
        private readonly IGetToken _getToken;
        private readonly IHttpRequestManager<List<Response>> _client;
        private readonly IConfiguration _configuration;
        private readonly IGetDescComuneProvincia _comuneService;

        public SetUscitaMezzo(IHttpRequestManager<List<Response>> client, IGetToken getToken, IConfiguration configuration, IGetDescComuneProvincia comuneService)
        {
            _getToken = getToken;
            _configuration = configuration;
            _client = client;
            _comuneService = comuneService;
        }

        public void Set(UscitaGAC uscita)
        {
            //OTTENGO PROVINCIA E COMUNE
            var territorio = _comuneService.GetComuneBy(uscita.comune.descrizione).Result;

            uscita.comune.codice = territorio.FirstOrDefault(x => x.descrizione.ToLower().Contains(uscita.comune.descrizione.ToLower()))?.codice;
            uscita.provincia.codice = territorio.FirstOrDefault(x => x.provincia.descrizione.ToLower().Contains(uscita.provincia.descrizione.ToLower()))?.codice;

            //USCITA GAC
            var lstUscite = new List<UscitaGAC>() { uscita };
            var jsonString = JsonConvert.SerializeObject(lstUscite);
            var content = new StringContent(jsonString);

            var uri = new Uri(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacUscitaMezzo);

            var result = _client.PutAsync(uri, content, _getToken.GeneraToken()).Result;

            if (result != null && result.TrueForAll(item => item.codiceEsito != "200" && item.codiceEsito != "201"))
            {
                throw new Exception($"Errore servizio uscita GAC: {result.First().codiceEsito}, {result.First().descrizioneEsito}");
            }
        }
    }
}
