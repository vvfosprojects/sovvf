using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
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

        public async Task<DettaglioDipententeResult> GetTelefonoDipendenteByIdDipendente(string IdDipendente)
        {
            string url = _config.GetSection("UrlExternalApi").GetSection("GestionePersonale").Value;
            var uri = new Uri($"{url}VisualizzaDettaglioDipendente?IdDipendente={IdDipendente}");

            _client.SetCache("DettaglioDipendente_" + IdDipendente);

            var result = _client.GetAsync(uri).Result;

            //result?.dati?.IdDipentente = IdDipendente;

            return result;
        }
    }
}
