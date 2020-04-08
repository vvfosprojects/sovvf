using Newtonsoft.Json;
using SO115App.ApiNUE.Model;
using System.Collections.Generic;
using System.IO;

namespace SO115App.ApiNUE.Services
{
    public class SetSchedaContatto
    {
        private const string SchedeContattoJson = "Fake/SchedeContatto.json";
        private const string Letta = "Letta";
        private const string Gestita = "Gestita";

        public List<SchedaContatto> Get()
        {
            const string filepath = SchedeContattoJson;
            string json;

            using (var r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            return JsonConvert.DeserializeObject<List<SchedaContatto>>(json);
        }

        public void Set(List<SchedaContatto> lista)
        {
            var updatedList = JsonConvert.SerializeObject(lista);
            File.WriteAllText(SchedeContattoJson, updatedList);
        }

        public void SetLetta(string codiceScheda, string codiceSede, string codiceFiscale, bool letta)
        {
            var schedeContatto = Get();

            foreach (var schedaContatto in schedeContatto.FindAll(x => x.CodiceScheda.Equals(codiceScheda)))
            {
                schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                schedaContatto.Letta = letta;
            }

            Set(schedeContatto);
        }

        public void SetGestita(string codiceScheda, string codiceSede, string codiceFiscale, bool gestita)
        {
            var schedeContatto = Get();

            foreach (var schedaContatto in schedeContatto.FindAll(x => x.CodiceScheda.Equals(codiceScheda)))
            {
                schedaContatto.OperatoreChiamata.CodiceFiscale = codiceFiscale;
                schedaContatto.OperatoreChiamata.CodiceSede = codiceSede;
                schedaContatto.Gestita = gestita;
                if (gestita)
                {
                    schedaContatto.Letta = true;
                }
            }

            Set(schedeContatto);
        }
    }
}
