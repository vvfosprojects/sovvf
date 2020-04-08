using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.FakePersistence.JSon.Utility;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistence.JSon.GestioneMezzi
{
    public class GetMezzoById : IGetMezzoByCodice
    {
        public Mezzo Get(string codiceMezzo)
        {
            var filepath = CostantiJson.Mezzo;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaMezzi = JsonConvert.DeserializeObject<List<Mezzo>>(json);

            return listaMezzi.Find(x => x.Codice.Equals(codiceMezzo));
        }
    }
}
