using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper
{
    public class GetMezzoById : IGetMezzoById
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetMezzoById(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<Mezzo> Get(string CodSede, int CodMezzo)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPIMezzi").Value}/GetMezzoUtilizzabileByCodMezzo?CodSede={CodSede}&CodMezzo={CodMezzo}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var MezzoOracle = await content.ReadAsAsync<ORAAutomezzi>().ConfigureAwait(false);
            return MapMezzoByIdOraInMongoDB(MezzoOracle, CodMezzo);
        }

        private Mezzo MapMezzoByIdOraInMongoDB(ORAAutomezzi MezzoOracle, int CodMezzo)
        {
            ORAAutomezzi OraM = MezzoOracle;
            Coordinate coordinate = new Coordinate(1, 1);
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();
            UnitaOperativa Uo = radice.GetSottoAlbero().Single(uo => uo.Codice == OraM.COD_COMANDO + "." + OraM.COD_DISTACCAMENTO);

            Sede sede = new Sede(Uo.Codice, Uo.Nome, "", coordinate, "", "", "", "", "");
            Mezzo mezzo = new Mezzo
            (
                OraM.COD_AUTOMEZZO.ToString(),
                OraM.COD_MODELLO_MEZZO,
                OraM.STATO,
                OraM.DISTACCAMENTO,
                OraM.COD_DESTINAZIONE,
                sede,
                coordinate
             )

            {
            };

            return mezzo;
        }
    }
}
