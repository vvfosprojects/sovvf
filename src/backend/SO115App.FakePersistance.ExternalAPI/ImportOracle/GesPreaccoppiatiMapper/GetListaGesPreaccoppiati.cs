using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Composizione;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati;
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
            var ListaPreAccoppiatiOracle = await content.ReadAsAsync<List<ORAGesPreaccoppiati>>().ConfigureAwait(false);
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
