using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper
{
    public class GetListaGesPreaccoppiati : IGetListaGesPreaccoppiati
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaGesPreaccoppiati(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<PreAccoppiati>> Get(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");

            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaGesPreaccoppiati?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var data = await content.ReadAsStringAsync().ConfigureAwait(false);
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
                    Id = Decimal.ToInt32(OraP.COD_DISTACCAMENTO).ToString() + "-" + Decimal.ToInt32(OraP.COD_AUTOMEZZO).ToString() + "-" + Decimal.ToInt32(OraP.COD_SQUADRA).ToString(), //OraP.COD_SQUADRA.ToString(),
                    Mezzo = OraP.TIPO_MEZZO + "." + OraP.TARGA_MEZZO,
                    CodiceSede = OraP.COD_COMANDO + "." + Decimal.ToInt32(OraP.COD_DISTACCAMENTO).ToString()
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
