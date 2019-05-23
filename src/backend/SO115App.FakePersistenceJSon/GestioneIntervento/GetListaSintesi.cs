using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetListaSintesi : IGetListaSintesiRichieste
    {
        public List<SintesiRichiesta> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            List<SintesiRichiesta> ListaSintesiRichieste = new List<SintesiRichiesta>();

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSintesiRichieste = JsonConvert.DeserializeObject<List<SintesiRichiesta>>(json);

            int id = 0;

            if (ListaSintesiRichieste != null)
            {
                foreach (SintesiRichiesta sintesi in ListaSintesiRichieste)
                {
                    sintesi.Priorita = MapProprietaSintesi(sintesi.Codice);
                    sintesi.Id = id.ToString();
                    id++;
                }


                ListaSintesiRichieste = ListaSintesiRichieste.OrderBy(x => x.Stato).OrderByDescending(x => x.IstanteRicezioneRichiesta).ToList();

                return ListaSintesiRichieste;

            }
            else
            {
                List<SintesiRichiesta> ListaSintesiRichiesteVuota = new List<SintesiRichiesta>();
                return ListaSintesiRichiesteVuota;
            }
 
        }

        public RichiestaAssistenza.Priorita MapProprietaSintesi(string Codicesintesi)
        {
            List<RichiestaAssistenzaRead> ListaRichieste = new List<RichiestaAssistenzaRead>();
            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }
            ListaRichieste = JsonConvert.DeserializeObject<List<RichiestaAssistenzaRead>>(json);

            RichiestaAssistenza.Priorita prio = new RichiestaAssistenza.Priorita();

            foreach (RichiestaAssistenzaRead richiesta in ListaRichieste)
            {
                if(Codicesintesi.Equals(richiesta.Codice))
                    prio = richiesta.PrioritaRichiesta;
            }

            return prio;

        }

    }
}
