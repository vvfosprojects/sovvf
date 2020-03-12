using Newtonsoft.Json;
using SO115App.API.DataFake.Classi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.DataFake.Services
{
    public class GetPreaccoppiati
    {
        public List<ListaPreaccoppiati> Get(string CodComando) 
        {
            var filepath = Costanti.ListaMezzi;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaPreaccoppiati = JsonConvert.DeserializeObject<List<ListaPreaccoppiati>>(json);

            return listaPreaccoppiati.FindAll(x => x.Sede.Split('.')[0].Equals(CodComando)).ToList();

        }
    }
}
