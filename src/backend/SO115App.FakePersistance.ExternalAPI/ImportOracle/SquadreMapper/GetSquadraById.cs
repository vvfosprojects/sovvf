using Microsoft.Extensions.Configuration;
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
    public class GetSquadraById : IGetSquadraById
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetSquadraById(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public async Task<Squadra> Get(string CodSede, decimal CodSquadra)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetSquadraByCodSquadra?CodSede={CodSede}&CodSquadra={CodSquadra}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var SquadraOracle = await content.ReadAsAsync<ORASquadre>().ConfigureAwait(false);

            var GetListaPersonaleSquadreById = new GetListaPersonaleSquadreById(_client, _configuration);
            var ListaPersonaleSquadre = await GetListaPersonaleSquadreById.Get(CodSede, CodSquadra);

            var GetSQPersonaleSquadreByCodSquadra = new GetSQPersonaleSquadreByCodSquadra(_client, _configuration);
            var SQPersonaleSquadre = await GetSQPersonaleSquadreByCodSquadra.Get(CodSede, CodSquadra);
            return MapSquadraByIdOraInMongoDB(SquadraOracle, ListaPersonaleSquadre, SQPersonaleSquadre);
        }

        private Squadra MapSquadraByIdOraInMongoDB(ORASquadre SquadraOracle, List<ORAPersonaleSquadre> ListaPersonaleSquadre, ORASQPersonaleSquadre SQPersonaleSquadre)
        {
            ORASquadre OraS = SquadraOracle;
            var Stato = Squadra.StatoSquadra.InSede;

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

            //ToDo associare correttamente i cari campi
            List<Componente> ComponentiSquadra = new List<Componente>();

            string codiceSede = OraS.COD_DISTACCAMENTO.ToString();
            var organigramma = new GetUnitaOperativaRadice_Con_Dir_Com_Dist();
            var radice = organigramma.Get();

            UnitaOperativa Uo = radice.GetSottoAlbero().Single(uo => uo.Codice == codiceSede);
            Coordinate coordinate = new Coordinate(1, 1);
            var sedeDistaccamento = new Sede(Uo.Codice, Uo.Nome, "", coordinate, "", "", "", "", "");

            //ListOraPS = ListaPersonaleSquadre.FindAll(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
            foreach (ORAPersonaleSquadre p in ListaPersonaleSquadre)
            {
                //estrarre nominativo da Cf con servizio
                var nominativo = "";
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

            return squadra;
        }
    }
}
