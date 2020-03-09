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

namespace SO115App.ExternalAPI.Fake.Servizi.Personale
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

        public async Task<List<Squadra>> Get(List<string> sedi)
        {
            List<Squadra> listaSquadre = new List<Squadra>();
            List<string> ListaCodiciSedi = new List<string>();

            var filepath = CostantiJson.ListaSqaudre;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSquadraFake = JsonConvert.DeserializeObject<List<SquadraFake>>(json);

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
                var ListaSquadreSede = listaSquadraFake.FindAll(x => x.Sede.Contains(CodSede));
                foreach (SquadraFake s in ListaSquadreSede)
                {
                    var squadra = MapSqaudra(s, CodSede);
                    listaSquadre.Add(squadra);
                }
            }

            return listaSquadre;
        }

        private Squadra MapSqaudra(SquadraFake sF, string CodSede)
        {
            Squadra.StatoSquadra Stato;

            switch (sF.Stato)
            {
                case "L": Stato = Squadra.StatoSquadra.InSede; break;
                case "A": Stato = Squadra.StatoSquadra.SulPosto; break;
                case "R": Stato = Squadra.StatoSquadra.InRientro; break;
                default: Stato = Squadra.StatoSquadra.InSede; break;
            }

            //ToDo inseire la chiamata al servizio per i dati del distaccamento
            var sedeDistaccamento = new Sede("xxx", "xxxx", "", new Coordinate(1, 1), "", "", "", "", "");

            List<string> ListaCodiciFiscaliComponentiSquadra = new List<string>();
            List<Componente> ComponentiSquadra = new List<Componente>();
            foreach (string cf in sF.ListaCodiciFiscaliComponentiSquadra)
            {
                //ToDo inseire la chiamata al servizio per i dati del personale
                Componente c = new Componente("", "", "", true, true, false);
                ComponentiSquadra.Add(c);
                ListaCodiciFiscaliComponentiSquadra.Add(cf);
            }

            Squadra s = new Squadra(sF.NomeSquadra, Stato, ComponentiSquadra, sedeDistaccamento);

            s.Id = sF.CodiceSquadra;
            s.ListaCodiciFiscaliComponentiSquadra = ListaCodiciFiscaliComponentiSquadra;
            return s;
        }
    }
}
