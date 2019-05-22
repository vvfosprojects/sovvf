using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class InserimentoRichiesta : ISaveRichiestaAssistenza
    {
        public void Save(RichiestaAssistenza richiestaAssistenza)
        {
            int MaxIdSintesi;
            try
            {
                string filepath = "Fake/ListaRichiesteAssistenza.json";
                string json;
                using (StreamReader r = new StreamReader(filepath))
                {
                    json = r.ReadToEnd();
                }

                List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

                if (ListaRichieste != null)
                    MaxIdSintesi = Convert.ToInt16(ListaRichieste.OrderByDescending(x => x.Codice).FirstOrDefault().Codice.Split('-')[1]) + 1;
                else
                    MaxIdSintesi = 1;

                richiestaAssistenza.Codice = richiestaAssistenza.Operatore.Sede.Codice.Split('.')[0] + "-" + MaxIdSintesi.ToString();

                if (ListaRichieste != null)
                {
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
            }catch(Exception ex)
            {

            }
        }
    }

}
