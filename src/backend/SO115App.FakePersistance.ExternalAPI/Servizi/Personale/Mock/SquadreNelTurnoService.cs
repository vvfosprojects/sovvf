using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Classi;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale.Mock
{
    public class SquadreNelTurnoService
    {
        private readonly string SquadreNelTurnoJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.ServiziSquadreJson);

        public List<Turno> GetListaSquadreNelTurno(string codiceSede, string codiceTurno)
        {
            string json;
            using (StreamReader r = new StreamReader(SquadreNelTurnoJson))
            {
                json = r.ReadToEnd();
            }

            var listaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            if (codiceTurno.Length > 0)
                return listaSquadreNelTurno.Where(x => x.Codice == codiceTurno && x.CodiceSede == codiceSede).ToList();
            else
                return listaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList();
        }

        public Squadra GetSquadraByCodice(string codiceSquadra, string codiceSede, string codiceTurno)
        {
            string json;
            using (StreamReader r = new StreamReader(SquadreNelTurnoJson))
            {
                json = r.ReadToEnd();
            }

            var listaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            Squadra squadraSel = null;

            foreach (Turno squadraNelTurno in listaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede && x.Codice == codiceTurno).ToList())
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
            string json;
            using (StreamReader r = new StreamReader(SquadreNelTurnoJson))
            {
                json = r.ReadToEnd();
            }

            var listaSquadreNelTurno = JsonConvert.DeserializeObject<List<Turno>>(json);

            return listaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList();
        }
    }
}
