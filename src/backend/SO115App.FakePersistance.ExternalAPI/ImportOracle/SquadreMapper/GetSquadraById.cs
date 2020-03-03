using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using System;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetSquadraById : IGetSquadraById
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;
        private readonly IGetPersonaleByCF _getPersonaleByCF;

        public GetSquadraById(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede, IGetPersonaleByCF GetPersonaleByCF)
        {
            _client = client;
            _configuration = configuration;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
            _getPersonaleByCF = GetPersonaleByCF;
        }

        public async Task<Squadra> Get(string CodSede, decimal CodSquadra)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetSquadraByCodSquadra?CodSede={CodSede}&CodSquadra={CodSquadra}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;

            string data = await content.ReadAsStringAsync().ConfigureAwait(false);
            ORASquadre SquadraOracle = JsonConvert.DeserializeObject<ORASquadre>(data);

            var GetListaPersonaleSquadreById = new GetListaPersonaleSquadreById(_client, _configuration);
            var ListaPersonaleSquadre = await GetListaPersonaleSquadreById.Get(CodSede, CodSquadra);

            var GetSQPersonaleSquadreByCodSquadra = new GetSQPersonaleSquadreByCodSquadra(_client, _configuration);
            var SQPersonaleSquadre = await GetSQPersonaleSquadreByCodSquadra.Get(CodSede, CodSquadra);
            return MapSquadraByIdOraInMongoDB(SquadraOracle, ListaPersonaleSquadre, SQPersonaleSquadre, CodSede);
        }

        private Squadra MapSquadraByIdOraInMongoDB(ORASquadre SquadraOracle, List<ORAPersonaleSquadre> ListaPersonaleSquadre, ORASQPersonaleSquadre SQPersonaleSquadre, string CodSede)
        {
            ORASquadre OraS = SquadraOracle;
            List<ORAPersonaleSquadre> ListOraPS = new List<ORAPersonaleSquadre>();

            List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(CodSede);
            var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(Decimal.ToInt32(OraS.COD_DISTACCAMENTO)));
            Sede sedeDistaccamento;
            if (d != null)
            {
                sedeDistaccamento = new Sede(CodSede.ToString() + "." + d.CodDistaccamento.ToString(), d.DescDistaccamento, d.Indirizzo, d.Coordinate, "", "", "", "", "");

                Squadra.StatoSquadra Stato;

                Stato = Squadra.StatoSquadra.InSede;
                if (SQPersonaleSquadre == null)
                {
                    Stato = Squadra.StatoSquadra.InSede;
                }
                else
                {
                    switch (SQPersonaleSquadre.STATO.ToString())
                    {
                        case "L": Stato = Squadra.StatoSquadra.InSede; break;
                        case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                        case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                        default: Stato = Squadra.StatoSquadra.InSede; break;
                    }
                }

                List<Componente> ComponentiSquadra = new List<Componente>();
                List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
                ListOraPS = ListaPersonaleSquadre.FindAll(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
                if (ListOraPS.Count > 0)
                {
                    foreach (ORAPersonaleSquadre p in ListOraPS)
                    {
                        ListaCodiciFiscaliComponentiSquadra.Add(p.MATDIP);

                        bool capoPartenza = false; bool autista = false;
                        if (p.FLAG_CAPO_SQUADRA.Equals("S")) capoPartenza = true;
                        if (p.AUTISTA.Equals("S")) autista = true;

                        PersonaleVVF pVVf = _getPersonaleByCF.Get(p.MATDIP, CodSede).Result;

                        Componente c = new Componente(p.QUALIFICA_ABBREV, pVVf.Nominativo, pVVf.Nominativo, capoPartenza, autista, false);
                        c.CodiceFiscale = pVVf.CodFiscale;

                        if (p.ORA_INIZIO.HasValue) c.OrarioInizio = (DateTime)p.ORA_INIZIO;
                        if (p.ORA_FINE.HasValue) c.OrarioInizio = (DateTime)p.ORA_FINE;

                        ComponentiSquadra.Add(c);
                    }
                }
                Squadra squadra = new Squadra(OraS.SIGLA, Stato, ComponentiSquadra, sedeDistaccamento);
                squadra.Id = OraS.COD_SQUADRA.ToString();
                squadra.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
                return squadra;
            }
            else
            {
                return null;//Se il distaccamento è vuoto non viene aggiunta la squadra
            };
        }
    }
}
