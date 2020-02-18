using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.SOVVF.FakeImplementations.Modello.Organigramma;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Condivise.Squadra;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetListaSquadre(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<List<Squadra>> Get(string CodSede)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaSquadre?CodSede={CodSede}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;

            string data = await content.ReadAsStringAsync().ConfigureAwait(false);

            var ListaSquadreOracle = JsonConvert.DeserializeObject<List<ORASquadre>>(data);

            var GetListaPersonaleSquadre = new GetListaPersonaleSquadre(_client, _configuration);

            var ListaPersonaleSquadre = await GetListaPersonaleSquadre.Get(CodSede);

            var GetListaSQPersonaleSquadre = new GetListaSQPersonaleSquadre(_client, _configuration);

            var ListaSQPersonaleSquadre = await GetListaSQPersonaleSquadre.Get(CodSede);

            return MapListaSquadreOraInMongoDB(ListaSquadreOracle, ListaPersonaleSquadre, ListaSQPersonaleSquadre);
        }

        private List<Squadra> MapListaSquadreOraInMongoDB(List<ORASquadre> ListaSquadreOracle, List<ORAPersonaleSquadre> ListaPersonaleSquadre, List<ORASQPersonaleSquadre> ListaSQPersonaleSquadre)
        {
            List<Squadra> ListaSquadre = new List<Squadra>();
            List<ORAPersonaleSquadre> ListOraPS = new List<ORAPersonaleSquadre>();

            foreach (ORASquadre OraS in ListaSquadreOracle)
            {
                var Stato = Squadra.StatoSquadra.InSede;
                //ToDo associare correttamente i cari campi
                List<Componente> ComponentiSquadra = new List<Componente>();

                string codiceSede = OraS.COD_DISTACCAMENTO.ToString();
                var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
                var radice = organigramma.Get();

                UnitaOperativa Uo = radice.GetSottoAlbero().Single(uo => uo.Codice == codiceSede);
                Coordinate coordinate = new Coordinate(1, 1);
                var sedeDistaccamento = new Sede(Uo.Codice, Uo.Nome, "", coordinate, "", "", "", "", "");

                ORASQPersonaleSquadre SQPersonaleSquadre = ListaSQPersonaleSquadre.Find(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
                switch (SQPersonaleSquadre.STATO.ToString())
                {
                    case "L":
                        Stato = Squadra.StatoSquadra.InSede;
                        break;

                    case "A":
                        Stato = Squadra.StatoSquadra.SulPosto;
                        break;

                    case "R":
                        Stato = Squadra.StatoSquadra.InRientro;
                        break;

                    default:
                        Stato = Squadra.StatoSquadra.Istituto;//'(????)
                        break;
                }

                ListOraPS = ListaPersonaleSquadre.FindAll(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
                foreach (ORAPersonaleSquadre p in ListOraPS)
                {
                    var nominativo = ""; //estrarre nominativo da Cf con servizio
                    bool capoPartenza;
                    bool autista;
                    if (p.FLAG_CAPO_SQUADRA.Equals("S"))
                        capoPartenza = true;
                    else
                        capoPartenza = false;
                    if (p.AUTISTA.Equals("S"))
                        autista = true;
                    else
                        autista = false;
                    Componente c = new Componente(p.QUALIFICA_ABBREV, nominativo, nominativo, capoPartenza, autista, false);
                    ComponentiSquadra.Add(c);
                }
                Squadra squadra = new Squadra(OraS.SIGLA, Stato, ComponentiSquadra, sedeDistaccamento);
                ListaSquadre.Add(squadra);
            }

            return ListaSquadre;
        }
    }
}
