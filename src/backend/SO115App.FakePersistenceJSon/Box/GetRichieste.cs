using Newtonsoft.Json;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Box;
using System;
using System.Collections.Generic;
using System.IO;

namespace SO115App.FakePersistenceJSon.Box
{
    public class GetRichieste : IGetBoxRichieste
    {
        public BoxInterventi Get()
        {
            BoxInterventi interventi = new BoxInterventi();
            string filepath = "Fake/ListaRichieste.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            List<SintesiRichiesta> ListaRichieste = JsonConvert.DeserializeObject<List<SintesiRichiesta>>(json);

            interventi.AnnoCorrente = DateTime.Now.Year;
            interventi.Assegnati = ListaRichieste.FindAll(x => x.Stato == 3).Count;
            interventi.Chiamate = ListaRichieste.FindAll(x => x.Stato == 0).Count;
            interventi.NomeTurnoCorrente = "B";
            interventi.NomeTurnoPrecedente = "A";
            interventi.Presidiati = ListaRichieste.FindAll(x => x.Stato == 2).Count;
            interventi.Sospesi = ListaRichieste.FindAll(x => x.Stato == 1).Count;
            interventi.TotAnnoCorrente = ListaRichieste.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
            interventi.TotTurnoCorrente = ListaRichieste.FindAll(x => x.IstanteRicezioneRichiesta.Year == DateTime.Now.Year).Count;
            interventi.TotTurnoPrecedente = 0;
            interventi.Totale = ListaRichieste.Count;

            return interventi;
        }
    }
}
