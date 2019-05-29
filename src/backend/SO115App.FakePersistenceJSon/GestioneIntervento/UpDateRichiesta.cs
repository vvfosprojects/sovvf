using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class UpDateRichiesta : IUpDateRichiestaAssistenza
    {
        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiRichiesta> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiesta>>(json);

            if (ListaRichieste != null)
            {
                SintesiRichiesta chiamata = (SintesiRichiesta)ListaRichieste.FirstOrDefault(x => x.Id == richiestaAssistenza.Id);
                ListaRichieste.Remove(chiamata);

                string fileText = System.IO.File.ReadAllText(@"Fake/ListaRichiesteAssistenza.json");
                string jsonNew = JsonConvert.SerializeObject(richiestaAssistenza);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", "[" + fileText.Substring(1, fileText.Length - 2) + "," + jsonNew + "]");
            }
            else
            {
                List<RichiestaAssistenza> ListaRichiesteNew = new List<RichiestaAssistenza>();
                ListaRichiesteNew.Add(richiestaAssistenza);

                string jsonNew = JsonConvert.SerializeObject(ListaRichiesteNew);
                System.IO.File.WriteAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);
            }
        }
    }
}
