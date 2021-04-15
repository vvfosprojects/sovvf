using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Qualifiche
{
    public class GetDettaglioQualificaByIdDipendenteByDate : IGetDettaglioQualificaByIdDipendenteByDate
    {
        private readonly IHttpRequestManager<DettaglioQualificaResult> _client;
        private readonly IConfiguration _config;

        public GetDettaglioQualificaByIdDipendenteByDate(IHttpRequestManager<DettaglioQualificaResult> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<DettaglioQualificaResult> GetByIdDipendenteByDate(string idDipendente, string date)
        {
            string url = _config.GetSection("UrlExternalApi").GetSection("GestionePersonale").Value;
            var uri = new Uri($"{url}QualificheDipendente?IdDipendente={idDipendente}&dtRiferimento={date}");

            _client.SetCache("DettaglioQualifiche_" + idDipendente);

            var result = _client.GetAsync(uri, null).Result;

            return result;
        }
    }
}
