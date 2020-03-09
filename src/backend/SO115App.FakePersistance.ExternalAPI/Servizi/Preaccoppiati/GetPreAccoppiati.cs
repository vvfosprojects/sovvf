using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using AutoMapper.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati;
using SO115App.ExternalAPI.Fake.Classi.DTOFake;
using SO115App.FakePersistence.JSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.ExternalAPI.Fake.Servizi.Preaccoppiati
{
    public class GetPreAccoppiati : IGetPreAccoppiati
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _configuration;

        public GetPreAccoppiati(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            _configuration = configuration;
        }

        public List<PreAccoppiati> Get(PreAccoppiatiQuery query)
        {
            var listaPreAccoppiati = new List<PreAccoppiati>();
            var filepath = CostantiJson.ListaPreAccoppiati;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var ListaPreAccoppiatiFake = JsonConvert.DeserializeObject<List<PreAccoppiatiFake>>(json);

            filepath = CostantiJson.ListaMezzi;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaMezziFake = JsonConvert.DeserializeObject<List<MezzoFake>>(json);

            var ListaPreAccoppiatiSede = ListaPreAccoppiatiFake.FindAll(x => x.Sede.Contains(query.CodiceSede));
            foreach (PreAccoppiatiFake p in ListaPreAccoppiatiSede)
            {
                var MezzoFake = listaMezziFake.Find(x => x.Targa.Equals(p.Targa));
                var PreAccoppiati = MapPreAccoppiati(p, MezzoFake);
                listaPreAccoppiati.Add(PreAccoppiati);
            }

            return listaPreAccoppiati;
        }

        private PreAccoppiati MapPreAccoppiati(PreAccoppiatiFake p, MezzoFake m)
        {
            List<string> Squadre = new List<string>();
            PreAccoppiati pA = new PreAccoppiati
            {
                Id = p.Sede + "-" + m.TipoMezzo + "." + m.Targa,
                Mezzo = m.TipoMezzo + "." + m.Targa,
                CodiceSede = p.Sede
            };
            foreach (string s in p.Squadre)
            {
                Squadre.Add(s);
            }

            p.Squadre = Squadre;
            return pA;
        }
    }
}
