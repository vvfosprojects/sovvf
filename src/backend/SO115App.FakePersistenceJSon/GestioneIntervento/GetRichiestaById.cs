using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using AutoMapper;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Classi.Soccorso.Eventi.Segnalazioni;
using SO115App.FakePersistenceJSon.Classi;
using SO115App.FakePersistenceJSon.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetRichiestaById : IGetRichiestaById
    {
        public RichiestaAssistenza Get(string idRichiestaAssistenza)
        {
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<RichiestaAssistenzaDTO> ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaDTO>>(json);

            RichiestaAssistenzaDTO richiesta = (RichiestaAssistenzaDTO)ListaRichieste.FirstOrDefault(x => x.Codice == idRichiestaAssistenza);

            RichiestaAssistenza richiestaReturn = MapperDTO.MapRichiestaDTOtoRichiesta(richiesta);

            return richiestaReturn;
        }
    }
}
