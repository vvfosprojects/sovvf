using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.DTOOracle;
using SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper;
using SO115App.ExternalAPI.Fake.ImportOracle.GestioniUtenti;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using static SO115App.API.Models.Classi.Condivise.Squadra;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;

namespace SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetListaDistaccamentiByCodiceSede _getListaDistaccamentiByCodiceSede;

        public GetListaSquadre(HttpClient client, IConfiguration configuration, IGetListaDistaccamentiByCodiceSede GetListaDistaccamentiByCodiceSede)
        {
            _client = client;
            _configuration = configuration;
            _getListaDistaccamentiByCodiceSede = GetListaDistaccamentiByCodiceSede;
        }

        public async Task<List<Squadra>> Get(List<string> sedi)
        {
            List<Squadra> listaSquadre = new List<Squadra>();
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
                var response = await _client.GetAsync($"{_configuration.GetSection("OracleImplementation").GetSection(CodSede).GetSection("UrlAPISquadre").Value}/GetListaSquadre?CodSede={CodSede}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;

                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                List<ORASquadre> ListaSquadreOracle = JsonConvert.DeserializeObject<List<ORASquadre>>(data);

                var GetListaPersonaleSquadre = new GetListaPersonaleSquadre(_client, _configuration);
                var ListaPersonaleSquadre = await GetListaPersonaleSquadre.Get(CodSede);

                var GetListaSQPersonaleSquadre = new GetListaSQPersonaleSquadre(_client, _configuration);
                var ListaSQPersonaleSquadre = await GetListaSQPersonaleSquadre.Get(CodSede);

                List<Squadra> listaSquadrePerSede = MapListaSquadreOraInMongoDB(ListaSquadreOracle, ListaPersonaleSquadre, ListaSQPersonaleSquadre, CodSede);

                foreach (Squadra s in listaSquadrePerSede)

                {
                    listaSquadre.Add(s);
                }
            }

            return listaSquadre;
        }

        private List<Squadra> MapListaSquadreOraInMongoDB(List<ORASquadre> ListaSquadreOracle, List<ORAPersonaleSquadre> ListaPersonaleSquadre, List<ORASQPersonaleSquadre> ListaSQPersonaleSquadre, string CodSede)
        {
            List<Squadra> ListaSquadre = new List<Squadra>();
            List<ORAPersonaleSquadre> ListOraPS = new List<ORAPersonaleSquadre>();

            foreach (ORASquadre OraS in ListaSquadreOracle)
            {
                List<Distaccamento> distaccamenti = _getListaDistaccamentiByCodiceSede.GetListaDistaccamenti(CodSede);
                var d = distaccamenti.Find(x => x.CodDistaccamento.Equals(Decimal.ToInt32(OraS.COD_DISTACCAMENTO)));
                Sede sedeDistaccamento;
                if (d != null)
                {
                    sedeDistaccamento = new Sede(CodSede.ToString() + "." + d.CodDistaccamento.ToString(), d.DescDistaccamento, d.Indirizzo, new Coordinate(1, 1), "", "", "", "", "");

                    Squadra.StatoSquadra Stato;
                    ORASQPersonaleSquadre SQPersonaleSquadre = new ORASQPersonaleSquadre();
                    SQPersonaleSquadre = ListaSQPersonaleSquadre.Find(x => x.COD_SQUADRA.Equals(OraS.COD_SQUADRA));
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
                            var GetPByCF = new GetPersonaleByCF(_client, _configuration);
                            PersonaleVVF pVVf = GetPByCF.Get(p.MATDIP, CodSede).Result;

                            bool capoPartenza = false; bool autista = false;
                            if (p.FLAG_CAPO_SQUADRA.Equals("S")) capoPartenza = true;
                            if (p.AUTISTA.Equals("S")) autista = true;

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
                    ListaSquadre.Add(squadra);
                }
                else
                {
                    //Se il distaccamento è vuoto non viene aggiunta la squadra
                }
            }

            return ListaSquadre;
        }
    }
}
