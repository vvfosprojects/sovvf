using Newtonsoft.Json;
using SO115App.ApiGac.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiGac.Services
{
    public class SetMezzo
    {
        private const string MezzoJson = "Fake/Mezzo.json";

        public void SetMovimentazione(string codice, Movimentazione movimentazione)
        {
            const string filepath = MezzoJson;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            var listaMezzi = JsonConvert.DeserializeObject<List<MezzoDTO>>(json);

            foreach (var mezzo in listaMezzi)
            {
                if (mezzo.Codice.Equals(codice))
                {
                    mezzo.Movimentazione = movimentazione;
                }
            }

            var updatedListaMezzi = JsonConvert.SerializeObject(listaMezzi);
            File.WriteAllText(MezzoJson, updatedListaMezzi);
        }
    }
}
