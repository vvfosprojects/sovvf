using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Statri;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.STATRI
{
    public class SendNewItem : ISendNewItemSTATRI
    {
        private readonly IConfiguration _config;
        private readonly IHttpRequestManager<List<ReturnMsg>> _client;
        private readonly IMapperRichiestaSuSintesi _mapperRichiestaSuSintesi;
        private readonly IMapperSintesiInSchedeSO115 _mapperSintesiInSchedeSO115;

        public SendNewItem(IConfiguration config, IHttpRequestManager<List<ReturnMsg>> client,
                           IMapperRichiestaSuSintesi mapperRichiestaSuSintesi,
                           IMapperSintesiInSchedeSO115 mapperSintesiInSchedeSO115)
        {
            _client = client;
            _mapperRichiestaSuSintesi = mapperRichiestaSuSintesi;
            _mapperSintesiInSchedeSO115 = mapperSintesiInSchedeSO115;
            _config = config;
        }

        public async Task<List<ReturnMsg>> InvioRichiesta(RichiestaAssistenza richiesta)
        {
            var sintesi = _mapperRichiestaSuSintesi.Map(richiesta);
            var schede = _mapperSintesiInSchedeSO115.Map(sintesi);

            var json = JsonConvert.SerializeObject(schede);
            var content = new StringContent(json);

            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("Statri").Value);

            var url = new Uri(baseurl, "import");

            var result = await _client.PostAsync(url, content);

            return result;
        }
    }
}
