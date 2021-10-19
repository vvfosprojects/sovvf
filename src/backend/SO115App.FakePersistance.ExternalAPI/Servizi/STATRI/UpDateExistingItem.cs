using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
    public class UpDateExistingItem : IUpDateExistingItem
    {
        private readonly IHttpRequestManager<List<ReturnMsg>> _client;
        private readonly IConfiguration _config;

        public UpDateExistingItem(IConfiguration config, IHttpRequestManager<List<ReturnMsg>> client)
        {
            _client = client;
            _config = config;
        }

        public async Task<List<ReturnMsg>> UpdateRichiesta(List<SchedaSO115> schede)
        {
            var json = JsonConvert.SerializeObject(schede);
            var content = new StringContent(json);

            var baseurl = new Uri(_config.GetSection("UrlExternalApi").GetSection("Statri").Value);

            var url = new Uri(baseurl, "UpdateRichiesta");

            var result = await _client.PostAsync(url, content);

            return result;
        }
    }
}
