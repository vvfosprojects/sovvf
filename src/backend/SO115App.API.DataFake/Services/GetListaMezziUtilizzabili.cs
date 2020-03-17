using Newtonsoft.Json;
using SO115App.API.DataFake.Classi;
using SO115App.Models.Classi.MongoDTO;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.DataFake.Services
{
    public class GetListaMezziUtilizzabili
    {

        public List<ListaMezziUtilizzabili> Get(string CodComando) 
        {
            var filepath = Costanti.ListaMezzi;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaMezzi = JsonConvert.DeserializeObject<List<ListaMezziUtilizzabili>>(json);

            return listaMezzi.FindAll(x => x.Sede.Split('.')[0].Equals(CodComando)).ToList();

        }

    }
}
