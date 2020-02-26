using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetPreAccoppiati(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<PreAccoppiati> Get(PreAccoppiatiQuery query)
        {
            return GetAsync(query).Result;
        }

        public async Task<List<PreAccoppiati>> GetAsync(PreAccoppiatiQuery query)
        {
            string CodSede = query.CodiceSede.Substring(0, 2);
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaGesPreaccoppiati?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            List<ORAGesPreaccoppiati> ListaPreAccoppiatiOracle = JsonConvert.DeserializeObject<List<ORAGesPreaccoppiati>>(data);
            return MapListaPreAccoppiatiOraInMongoDB(ListaPreAccoppiatiOracle);
        }

        private List<PreAccoppiati> MapListaPreAccoppiatiOraInMongoDB(List<ORAGesPreaccoppiati> ListaPreAccoppiatiOracle)
        {
            List<PreAccoppiati> ListaPreAccoppiati = new List<PreAccoppiati>();
            foreach (ORAGesPreaccoppiati OraP in ListaPreAccoppiatiOracle)
            {
                List<string> sList = new List<string>();
                PreAccoppiati p = new PreAccoppiati
                {
                    Id = OraP.COD_DISTACCAMENTO.ToString() + "-" + OraP.COD_AUTOMEZZO.ToString() + "-" + OraP.COD_SQUADRA.ToString(),
                    Mezzo = OraP.COD_AUTOMEZZO.ToString(),
                    CodiceSede = OraP.COD_COMANDO
                };

                sList.Add(OraP.COD_SQUADRA.ToString());
                string[] Squadre = sList.ToArray();
                p.Squadre = Squadre;

                ListaPreAccoppiati.Add(p);
            }

            return ListaPreAccoppiati;
        }
    }
}
