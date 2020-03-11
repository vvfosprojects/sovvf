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
        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoByCodiceSedeUC;
        private readonly IGetPersonaleByCF _getPersonaleByCF;

        public GetListaSquadre(IGetDistaccamentoByCodiceSedeUC GetDistaccamentoByCodiceSedeUC, IGetPersonaleByCF GetPersonaleByCF)
        {
            _getDistaccamentoByCodiceSedeUC = GetDistaccamentoByCodiceSedeUC;
            _getPersonaleByCF = GetPersonaleByCF;
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
