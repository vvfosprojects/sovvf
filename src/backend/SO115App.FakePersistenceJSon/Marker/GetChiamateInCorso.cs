using Newtonsoft.Json;
using SO115App.Models.Classi.Marker;
using SO115App.Models.Servizi.Infrastruttura.Marker;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistenceJSon.Marker
{
    public class GetChiamateInCorso : IGetChiamateInCorso
    {
        public List<ChiamateInCorso> Get()
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
                return ListaRichieste;
            }
            else
            {
                List<ChiamateInCorso> ListaRichiesteNew = new List<ChiamateInCorso>();
                return ListaRichiesteNew;
            }
        }
    }
}
