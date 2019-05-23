using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Box;
using System;
using System.IO;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetBoxMezzi : IGetBoxMezzi
    {

        public BoxMezzi Get()
        {

            BoxMezzi mezzi = new BoxMezzi();

            string filepath = "Fake/BoxMezzi.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            mezzi = JsonConvert.DeserializeObject<BoxMezzi>(json);

            return mezzi;
        }

    }
}
