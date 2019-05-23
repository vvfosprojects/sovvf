using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetMaxCodice : IGetMaxCodice
    {
        public int GetMax()
        {
            int MaxIdSintesi;

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
                MaxIdSintesi = Convert.ToInt16(ListaRichieste.OrderByDescending(x => x.Codice).FirstOrDefault().Codice.Split('-')[1]);
            else
                MaxIdSintesi = 1;

            return MaxIdSintesi;

        }
    }
}
