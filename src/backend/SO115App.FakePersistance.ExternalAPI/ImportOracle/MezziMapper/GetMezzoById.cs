using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezzoById : IGetMezzoById
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getDistaccamentoByCodSede;

        public GetMezzoById(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede getDistaccamentoByCodSede)
        {
            _client = client;
            _configuration = configuration;
            _getDistaccamentoByCodSede = getDistaccamentoByCodSede;
        }

        public async Task<Mezzo> Get(string CodSede, int CodMezzo)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIMezzi").Value}/GetMezzoUtilizzabileByCodMezzo?CodSede={CodSede}&CodMezzo={CodMezzo}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            ORAAutomezzi MezzoOracle = JsonConvert.DeserializeObject<ORAAutomezzi>(data);
            return MapMezzoByIdOraInMongoDB(MezzoOracle, CodMezzo);
        }

        private Mezzo MapMezzoByIdOraInMongoDB(ORAAutomezzi MezzoOracle, int CodMezzo)
        {
            ORAAutomezzi OraM = MezzoOracle;
            List<Distaccamento> distaccamenti = _getDistaccamentoByCodSede.GetListaDistaccamenti(OraM.COD_COMANDO);
            var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(OraM.COD_DISTACCAMENTO));
            var sede = new Sede(OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO, d.DescDistaccamento, d.Indirizzo, d.Coordinate, "", "", "", "", "");

            Mezzo mezzo = new Mezzo
            (
                OraM.COD_AUTOMEZZO.ToString(),
                OraM.COD_MODELLO_MEZZO,
                OraM.STATO,
                OraM.DISTACCAMENTO,
                OraM.COD_DESTINAZIONE,
                sede,
                new Coordinate(1, 1)
             )
            {
                Genere = OraM.COD_GENERE_MEZZO,
            };

            return mezzo;
        }
    }
}
