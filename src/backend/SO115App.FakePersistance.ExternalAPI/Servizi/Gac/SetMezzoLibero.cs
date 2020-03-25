using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetMezzoLibero : ISetMezzoLibero
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public SetMezzoLibero(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task Set(string codMezzo, DateTime dataMov, string idRichiesta)
        {
            try
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var listaMovimentazione = new List<FineMovimentazioneDTO>
            {
                new FineMovimentazioneDTO
                {
                    CodiceMezzo = codMezzo,
                    DataMovimentazione = dataMov,
                    IdRichiesta = idRichiesta,
                }
            };
                var json = JsonConvert.SerializeObject(listaMovimentazione);
                var content = new StringContent(json);
                content.Headers.ContentType.MediaType = "application/json";
                var response = await _client.PutAsync(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacSetMezzoLibero, content).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
