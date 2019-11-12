using Newtonsoft.Json;
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
        public static List<SquadreNelTurno> GetListaSquadreNelTurno(string codiceSede, string codiceTurno)
        {
            List<SquadreNelTurno> ListaSquadreNelTurno = new List<SquadreNelTurno>();

            string filepath = Costanti.ServiziSquadreJson;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<SquadreNelTurno>>(json);

            if (codiceTurno.Length > 0)
                return ListaSquadreNelTurno.Where(x => x.Codice == codiceTurno && x.CodiceSede == codiceSede).ToList();
            else
                return ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList();
        }

        public static SquadraDTO GetSquadraByCodice(string codiceSquadra, string codiceSede, string codiceTurno)
        {
            List<SquadreNelTurno> ListaSquadreNelTurno = new List<SquadreNelTurno>();

            string filepath = Costanti.ServiziSquadreJson;
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<SquadreNelTurno>>(json);

            SquadraDTO squadraSel = new SquadraDTO();

            foreach (SquadreNelTurno squadraNelTurno in ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede && x.Codice == codiceTurno).ToList())
            {
                foreach (SquadraDTO squadra in squadraNelTurno.ListaSquadre)
                {
                    if (squadra.Codice.Equals(codiceSquadra))
                        squadraSel = squadra;
                }
            }

            return squadraSel;
        }
    }
}
