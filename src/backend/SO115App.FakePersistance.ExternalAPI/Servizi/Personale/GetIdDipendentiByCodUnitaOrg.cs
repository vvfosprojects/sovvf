using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetIdDipendentiByCodUnitaOrg : IGetIdDipendentiByCodUnitaOrg
    {
        private readonly IHttpRequestManager<DipententiResult> _client;
        private readonly IConfiguration _config;

        public GetIdDipendentiByCodUnitaOrg(IHttpRequestManager<DipententiResult> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<List<string>> Get(string CodUnita)
        {
            string url = _config.GetSection("UrlExternalApi").GetSection("GestionePersonale").Value;
            var uri = new Uri($"{url}RicercaFiltrataDipendente");

            var jsonString = JsonConvert.SerializeObject(new Body() { listaCodUnitaOrganizzativa = new string[] { CodUnita } });
            var content = new StringContent(jsonString);

            _client.SetCache("GestionePersonale_" + CodUnita);

            var result = _client.PostAsync(uri, content, null).Result;

            return result.dati.Select(d => d.idDipendente).ToList();
        }

        public class Body
        {
            public string[] listaCodUnitaOrganizzativa { get; set; }
            public string flCessato { get; set; } = "N";
        }

        public class DipententiResult
        {
            public Dati[] dati { get; set; }
        }

        public class Dati
        {
            public string idDipendente { get; set; }
        }
    }
}
