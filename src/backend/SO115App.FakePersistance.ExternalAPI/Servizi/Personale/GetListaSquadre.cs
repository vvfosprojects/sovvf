using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre;
using SO115App.FakePersistence.JSon.Utility;
using System.IO;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Classi.Utenti.Autenticazione;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
{
    public class GetListaSquadre : IGetListaSquadre
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;

        public GetListaSquadre(HttpClient client, IConfiguration configuration, IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC, IGetPersonaleByCF GetPersonaleByCF)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
            _client = client;
            _configuration = configuration;
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

            var ListaMezzi = new List<Mezzo>();
            foreach (string CodSede in ListaCodiciSedi)
            {
                _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
                var response = await _client.GetAsync($"{_configuration.GetSection("DataFakeImplementation").GetSection("UrlAPISquadre").Value}/GetListaSquadreByCodComando?CodComando={CodSede}").ConfigureAwait(false);
                response.EnsureSuccessStatusCode();
                using HttpContent content = response.Content;

                string data = await content.ReadAsStringAsync().ConfigureAwait(false);
                List<SquadraFake> ListaSquadreSede = JsonConvert.DeserializeObject<List<SquadraFake>>(data);

                foreach (SquadraFake squadraFake in ListaSquadreSede)
                {
                    var squadra = MapSqaudra(squadraFake, CodSede);
                    listaSquadre.Add(squadra);
                }
            }

            return listaSquadre;
        }

        private Squadra MapSqaudra(SquadraFake squadraFake, string CodSede)
        {
            Squadra.StatoSquadra Stato;

            switch (squadraFake.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            var distaccamento = new Distaccamento();
            distaccamento = _getDistaccamentoByCodiceSedeUC.Get(squadraFake.Sede).Result;
            var sedeDistaccamento = new Sede(squadraFake.Sede, distaccamento.DescDistaccamento, distaccamento.Indirizzo, distaccamento.Coordinate, "", "", "", "", "");

            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
            List<Componente> ComponentiSquadra = new List<Componente>();
            foreach (string cf in squadraFake.ListaCodiciFiscaliComponentiSquadra)
            {
                PersonaleVVF pVVf = _getPersonaleByCF.Get(cf).Result;

                bool capoPartenza = false; bool autista = false;
                Componente c = new Componente("", pVVf.Nominativo, pVVf.Nominativo, capoPartenza, autista, false)
                {
                    CodiceFiscale = pVVf.CodFiscale,
                };
            }

            Squadra s = new Squadra(squadraFake.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento);

            s.Id = squadraFake.CodiceSquadra;
            s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
            return s;
        }
    }
}
