using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Newtonsoft.Json;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetChiamateInCorso : IChiamateInCorso
    {

        public void AddChiamata(ChiamateInCorso chiamata)
        {
            string filepath = "Fake/ListaChiamateInCorso.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<ChiamateInCorso> ListaRichieste = JsonConvert.DeserializeObject<List<ChiamateInCorso>>(json);

            if (ListaRichieste != null)
            {
                string fileText = System.IO.File.ReadAllText(@"Fake/ListaChiamateInCorso.json");
                string jsonNew = JsonConvert.SerializeObject(chiamata);
                System.IO.File.WriteAllText(@"Fake/ListaChiamateInCorso.json", "[" + fileText.Substring(1, fileText.Length - 2) + "," + jsonNew + "]");
            }
            else
            {
                List<ChiamateInCorso> ListaRichiesteNew = new List<ChiamateInCorso>();
                ListaRichiesteNew.Add(chiamata);

                string jsonNew = JsonConvert.SerializeObject(ListaRichiesteNew);
                System.IO.File.WriteAllText(@"Fake/ListaChiamateInCorso.json", jsonNew);
            }
        }
    }
}
