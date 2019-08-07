using Newtonsoft.Json;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace SO115App.FakePersistence.JSon.GestioneMezzi
{
    internal class GetMezzoById : IGetMezzoByCodice
    {
        public Mezzo Get(String CodiceMezzo)
        {
            ComposizioneMezzi composizione = new ComposizioneMezzi();
            List<ComposizioneMezzi> ListaComposizione = new List<ComposizioneMezzi>();
            MezzoPrenotato mezzoPrenotato = new MezzoPrenotato();
            string filepath = "Fake/MezziComposizione.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaComposizione = JsonConvert.DeserializeObject<List<ComposizioneMezzi>>(json);
            composizione = ListaComposizione.Where(x => x.Mezzo.Codice.Equals(CodiceMezzo)).FirstOrDefault();
            return composizione.Mezzo;
        }
    }
}
