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
        public GetPreAccoppiati()
        {
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
            foreach (PreAccoppiatiFake preAccoppiatiFake in ListaPreAccoppiatiSede)
            {
                var MezzoFake = listaMezziFake.Find(x => x.Targa.Equals(preAccoppiatiFake.Targa));
                var PreAccoppiati = MapPreAccoppiati(preAccoppiatiFake, MezzoFake);
                listaPreAccoppiati.Add(PreAccoppiati);
            }

            return listaPreAccoppiati;
        }

        private PreAccoppiati MapPreAccoppiati(PreAccoppiatiFake preAccoppiatiFake, MezzoFake mezzoFake)
        {
            List<string> sList = new List<string>();

            PreAccoppiati preAccoppiati = new PreAccoppiati
            {
                Id = preAccoppiatiFake.Sede + "-" + mezzoFake.TipoMezzo + "." + mezzoFake.Targa,
                Mezzo = mezzoFake.TipoMezzo + "." + mezzoFake.Targa,
                CodiceSede = preAccoppiatiFake.Sede
            };
            foreach (string s in preAccoppiatiFake.Squadre)
            {
                sList.Add(s);
            }
            string[] squadre = sList.ToArray();
            preAccoppiati.Squadre = squadre;
            return preAccoppiati;
        }
    }
}
