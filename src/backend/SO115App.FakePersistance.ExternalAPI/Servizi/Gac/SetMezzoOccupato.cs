using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Gac;
using SO115App.Models.Classi.ServiziEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Servizi.Gac
{
    public class SetMezzoOccupato : ISetMezzoOccupato
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public SetMezzoOccupato(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task Set(string codMezzo, DateTime dataMov, string idRichiesta, string codTipologia, string descTipologia)
        {
            try
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var listMovimentazione = new List<MovimentazioneDTO>
                {
                    new MovimentazioneDTO
                    {
                        CodiceMezzo = codMezzo,
                        DataMovimentazione = dataMov,
                        IdRichiesta = idRichiesta,
                        TipoUscita = new TipoUscita
                        {
                            Codice = codTipologia,
                            Descrizione = descTipologia
                        }
                    }
                }; //Il servizio GAC si aspetta un array

                DefaultContractResolver contractResolver = new DefaultContractResolver
                {
                    NamingStrategy = new CamelCaseNamingStrategy()
                };
                var json = JsonConvert.SerializeObject(listMovimentazione, new JsonSerializerSettings
                {
                    ContractResolver = contractResolver,
                    Formatting = Formatting.Indented
                });

                var content = new StringContent(json);
                content.Headers.ContentType.MediaType = "application/json";

                var response = await _client.PutAsync(_configuration.GetSection("UrlExternalApi").GetSection("GacApi").Value + Costanti.GacSetMezzoOccupato, content).ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
