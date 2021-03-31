using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetDettaglioDipendenteById : IGetDettaglioDipendenteById
    {
        private readonly IHttpRequestManager<DettaglioDipententeResult> _client;
        private readonly IConfiguration _config;

        public GetDettaglioDipendenteById(IHttpRequestManager<DettaglioDipententeResult> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<string> GetTelefonoDipendenteByIdDipendente(string IdDipendente)
        {
            string url = _config.GetSection("UrlExternalApi").GetSection("GestionePersonale").Value;
            var uri = new Uri($"{url}VisualizzaDettaglioDipendente?IdDipendente={IdDipendente}");

            _client.SetCache("GestionePersonale_" + IdDipendente);

            var result = _client.GetAsync(uri, null).Result;

            return result.telCellulare;
        }

        public class DettaglioDipententeResult
        {
            public string telefonoFisso {get; set;}
            public string telCellulare {get; set;}
            public string fax { get; set; }

            public string oraIngresso { get; set; }

            public string codFiscale { get; set; }
        }
    }
}
