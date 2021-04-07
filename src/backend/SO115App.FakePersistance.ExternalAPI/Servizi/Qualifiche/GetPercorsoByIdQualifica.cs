using Microsoft.Extensions.Configuration;
using SO115App.ExternalAPI.Client;
using SO115App.Models.Classi.ServiziEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Qualifiche;
using System;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Qualifiche
{
    public class GetPercorsoByIdQualifica : IGetPercorsoByIdQualifica
    {
        private readonly IConfiguration _config;
        private readonly IHttpRequestManager<PercorsoQualifica> _client;
        public GetPercorsoByIdQualifica(IHttpRequestManager<PercorsoQualifica> client, IConfiguration config)
        {
            _client = client;
            _config = config;
        }

        public async Task<PercorsoQualifica> Get(string idQualifica)
        {
            _client.SetCache($"Qualifica_{idQualifica}");

            var baseurl = _config.GetSection("UrlExternalApi").GetSection("GestioneQualifiche").Value;
            var url = new Uri($"{baseurl}Qualifica/GetPercorsoByIdQualifica?idQualifica={idQualifica}");

            try
            {
                var result = _client.GetAsync(url, "").Result;

                return result;

            }
            catch (Exception e)
            {
                e = e.GetBaseException();

                throw new Exception($"Servizio qualifiche non disponibile: {e.Message} {e.StackTrace}");
            }
        }
    }
}
