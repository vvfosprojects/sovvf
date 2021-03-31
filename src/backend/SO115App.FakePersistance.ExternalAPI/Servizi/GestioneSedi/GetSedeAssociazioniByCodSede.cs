using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.GestioneSedi
{
    public class GetSedeAssociazioniByCodSede : IGetSedeAssociazioniByCodSede
    {
        private readonly IHttpRequestManager<CodUnitaOrganizzativaResult> _client;
        private readonly IConfiguration _config;

        public GetSedeAssociazioniByCodSede(IHttpRequestManager<CodUnitaOrganizzativaResult> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<string> GetCodUnitaOrganizzativaByCodSede(string CodSede)
        {
            string url = _config.GetSection("UrlExternalApi").GetSection("GestioneSedi").Value;
            var uri = new Uri($"{url}AssociazioneUOSedi/RicercaEstesaAssociazioniUOSedi?codAssociativo={CodSede}");

            _client.SetCache("GestioneSedi_" + CodSede);

            var result = _client.GetAsync(uri, null).Result;

            return result.dati.FirstOrDefault()?.codUnitaOrganizzativa;
        }
    }

    public class CodUnitaOrganizzativaResult
    {
        public Dati[] dati { get; set; }
    }

    public class Dati
    {
        public string codUnitaOrganizzativa { get; set; }
    }
}
