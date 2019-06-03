using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.FakePersistenceJSon.GestioneIntervento
{
    public class GetListaSintesi : IGetListaSintesi
    {
        public List<SintesiRichieste> GetListaSintesiRichieste(FiltroRicercaRichiesteAssistenza filtro)
        {
            List<SintesiRichieste> ListaSintesiRichieste = new List<SintesiRichieste>();

            string filepath = "Fake/ListaRichiesteAssistenza.json";
            string json;

            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSintesiRichieste = JsonConvert.DeserializeObject<List<SintesiRichieste>>(json);

            int id = 1;

            if (ListaSintesiRichieste != null)
            {
                foreach (SintesiRichieste sintesi in ListaSintesiRichieste)
                {
                    sintesi.Id = id.ToString();
                    sintesi.Stato = MapStatoRichiesta(sintesi);
                    id++;
                }

                ListaSintesiRichieste = ListaSintesiRichieste.OrderByDescending(x => x.IstanteRicezioneRichiesta).OrderBy(x => x.Stato).ToList();

                return ListaSintesiRichieste;
            }
            else
            {
                List<SintesiRichieste> ListaSintesiRichiesteVuota = new List<SintesiRichieste>();
                return ListaSintesiRichiesteVuota;
            }
        }

        private int MapStatoRichiesta(SintesiRichieste sintesi)
        {
            /*
            Controlli sui codici
            Se lo stato è 0 - InAttesa
            Se lo stato è 1 - Sospesa
            Se lo stato è 2 - Presidiata
            Se lo stato è 3 - Assegnata
            Se lo stato è 4 - Chiusa
            */

            int stato = 0;

            if (sintesi.Chiusa)
                stato = 4;

            if (sintesi.Sospesa)
                stato = 1;

            if (sintesi.Aperta)
            {
                if (sintesi.Presidiato)
                    stato = 2;
                else if (sintesi.IstantePrimaAssegnazione != null)
                    stato = 3;
            }

            return stato;
        }
    }
}
