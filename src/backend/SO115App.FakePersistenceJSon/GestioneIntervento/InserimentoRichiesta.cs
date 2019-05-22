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

                List<RichiestaAssistenza> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenza>>(json);

                if (ListaRichieste != null)
                    MaxIdSintesi = Convert.ToInt16(ListaRichieste.OrderByDescending(x => x.Codice).FirstOrDefault().Codice.Split('-')[1]) + 1;
                else
                    MaxIdSintesi = 1;

                richiestaAssistenza.Codice = richiestaAssistenza.Operatore.Sede.Codice.Split('.')[0] + "-" + MaxIdSintesi.ToString();

                if (ListaRichieste != null)
                {
                    ListaRichieste.Add(richiestaAssistenza);
                    string jsonNew = JsonConvert.SerializeObject(ListaRichieste);
                    System.IO.File.AppendAllText(@"Fake/ListaRichiesteAssistenza.json", jsonNew);

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

    class EventiConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
        {
            return (objectType == typeof(Evento));
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            return serializer.Deserialize(reader, typeof(Evento));
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            serializer.Serialize(writer, value, typeof(Evento));
        }
    }
}
