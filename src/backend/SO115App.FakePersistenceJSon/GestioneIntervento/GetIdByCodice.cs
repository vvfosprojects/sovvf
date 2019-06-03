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
    public class GetIdByCodice : IGetIdByCodice
    {
        public string Get(string codice)
        {
            string IdRichiesta;

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaRead> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            if (ListaRichieste != null)
                IdRichiesta = ((RichiestaAssistenzaRead)ListaRichieste.FirstOrDefault(ric => ric.Codice == codice)).Id;
            else
                IdRichiesta = "";

            return IdRichiesta;
        }
    }
}
