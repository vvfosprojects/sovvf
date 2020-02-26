using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using Newtonsoft.Json;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezziUtilizzabili : IGetMezziUtilizzabili

    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;

        public GetMezziUtilizzabili(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede)
        {
            _client = client;
            _configuration = configuration;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
        }

        public async Task<List<Mezzo>> Get(List<string> sedi, string genereMezzo = null, string codiceMezzo = null)
        {
            List<Mezzo> ListaMezzi = new List<Mezzo>();
            List<string> ListaCodiciSedi = new List<string>();
            foreach (string sede in sedi)
            {
                var codice = sede.Substring(0, 2);
                string codiceE = "";
                codiceE = ListaCodiciSedi.Find(x => x.Equals(codice));
                if (string.IsNullOrEmpty(codiceE))
                {
                    ListaCodiciSedi.Add(codice);
                }
            }

            foreach (string CodSede in ListaCodiciSedi)
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIMezzi").Value}/GetListaMezziUtilizzabili?CodSede={CodSede}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;
                var data = await content.ReadAsStringAsync().ConfigureAwait(false);
                var ListaMezziOracle = JsonConvert.DeserializeObject<List<ORAAutomezzi>>(data);
                List<Mezzo> ListaMezziCodiceSede = MapListaMezziOraInMongoDB(ListaMezziOracle);

                foreach (Mezzo Mezzo in ListaMezziCodiceSede)
                {
                    ListaMezzi.Add(Mezzo);
                }
            }

            return ListaMezzi;
        }

        private List<Mezzo> MapListaMezziOraInMongoDB(List<ORAAutomezzi> ListaMezziOracle)
        {
            List<Mezzo> ListaMezzi = new List<Mezzo>();
            foreach (ORAAutomezzi OraM in ListaMezziOracle)
            {
                List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(OraM.COD_COMANDO);
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
