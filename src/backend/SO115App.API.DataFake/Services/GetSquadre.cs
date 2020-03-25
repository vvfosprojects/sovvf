using Newtonsoft.Json;
using SO115App.API.DataFake.Classi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.API.DataFake.Services 
{
    public class GetSquadre
    {
        public List<ListaSquadre> Get(string CodComando)
        {
            var filepath = Costanti.ListaSquadre;
            string json;
            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaSquadre = JsonConvert.DeserializeObject<List<ListaSquadre>>(json);
            return listaSquadre.FindAll(x => x.Sede.Equals(CodComando)).ToList();
        }
    }
}
