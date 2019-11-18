using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Classi.Servizi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale.Mock
{
    public class SquadreNelTurnoService
    {
        public List<Turno> GetListaSquadreNelTurno(string codiceSede, string codiceTurno)
        {
            List<Turno> ListaSquadreNelTurno = new List<Turno>();

            string filepath = Costanti.ServiziSquadreJson;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            if (codiceTurno.Length > 0)
                return ListaSquadreNelTurno.Where(x => x.Codice == codiceTurno && x.CodiceSede == codiceSede).ToList();
            else
                return ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList();
        }

        public Squadra GetSquadraByCodice(string codiceSquadra, string codiceSede, string codiceTurno)
        {
            List<Turno> ListaSquadreNelTurno = new List<Turno>();

            string filepath = Costanti.ServiziSquadreJson;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            Squadra squadraSel = null;

            foreach (Turno squadraNelTurno in ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede && x.Codice == codiceTurno).ToList())
            {
                foreach (Squadra squadra in squadraNelTurno.ListaSquadre)
                {
                    if (squadra.Codice.Equals(codiceSquadra))
                        squadraSel = squadra;
                }
            }

            return squadraSel;
        }

        public List<Turno> GetListaSquadreBySede(string codiceSede)
        {
            List<Turno> ListaSquadreNelTurno = new List<Turno>();

            string filepath = Costanti.ServiziSquadreJson;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            return ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList();
        }
    }
}
