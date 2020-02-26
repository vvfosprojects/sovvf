using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezziByCodiceMezzo : IGetMezziByCodiceMezzo
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetMezziByCodiceMezzo(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<Mezzo> Get(List<string> codiceMezzo, string codSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(codSede.Substring(0, 2)).GetSection("UrlAPIMezzi").Value}/GetListaMezziUtilizzabili?CodSede={codSede.Substring(0, 2)}").ConfigureAwait(false);
            List<ORAAutomezzi> ListaMezziOracle = JsonConvert.DeserializeObject<List<ORAAutomezzi>>(response.ToString());

            return MapListaMezziOraInMongoDB(ListaMezziOracle, codiceMezzo);
        }

        private List<Mezzo> MapListaMezziOraInMongoDB(List<ORAAutomezzi> ListaMezziOracle, List<string> codiceMezzo)
        {
            List<Mezzo> ListaMezzi = new List<Mezzo>();

            foreach (var codice in codiceMezzo)
            {
                var OraM = ListaMezziOracle.Find(x => x.COD_AUTOMEZZO.Equals(codice));

                GetDistaccamentiByCodSede GetDistaccamentiByCodSede = new GetDistaccamentiByCodSede(_client, _configuration);
                List<Distaccamento> distaccamenti = GetDistaccamentiByCodSede.GetListaDistaccamenti(OraM.COD_COMANDO);
                var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(OraM.COD_DISTACCAMENTO));

                var sede = new Sede(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO, d.DescDistaccamento, d.Indirizzo, new Coordinate(1, 1), "", "", "", "", "");

                Mezzo mezzo = new Mezzo(OraM.COD_AUTOMEZZO.ToString(),
                    OraM.COD_MODELLO_MEZZO,
                    OraM.STATO,
                    OraM.DISTACCAMENTO,
                    OraM.COD_DESTINAZIONE,
                    sede,
                    new Coordinate(1, 1))
                {
                    Genere = OraM.COD_GENERE_MEZZO,
                };
                ListaMezzi.Add(mezzo);
            }

            return ListaMezzi;
        }
    }
}
