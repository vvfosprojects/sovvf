using Newtonsoft.Json;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class DelChiamataInCorso : IDeleteChiamataInCorso
    {
        void IDeleteChiamataInCorso.DeleteChiamataInCorso(string IdChiamataInCorso)
        {
            string filepath = "Fake/ListaChiamateInCorso.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            try
            {
                List<ChiamateInCorso> ListaRichieste = JsonConvert.DeserializeObject<List<ChiamateInCorso>>(json);

                if (ListaRichieste != null)
                {
                    ChiamateInCorso chiamata = (ChiamateInCorso)ListaRichieste.FirstOrDefault(x => x.id == IdChiamataInCorso);
                    ListaRichieste.Remove(chiamata);

                    string jsonNew = JsonConvert.SerializeObject(ListaRichieste);
                    System.IO.File.WriteAllText(@"Fake/ListaChiamateInCorso.json", jsonNew);
                }
                else
                {
                    List<ChiamateInCorso> ListaRichiesteNew = new List<ChiamateInCorso>();
                    string jsonNew = JsonConvert.SerializeObject(ListaRichiesteNew);
                    System.IO.File.WriteAllText(@"Fake/ListaChiamateInCorso.json", jsonNew);
                }
            }
            catch (Exception ex)
            {
            }

        }
    }
}
