using Newtonsoft.Json;
using SO115App.ApiServizi.Classi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.ApiServizi.Servizi
{
    public class SquadreNelTurnoService
    {
        public static List<SquadreNelTurno> GetListaSquadreNelTurno(string codiceSede, string codiceTurno)
        {
            List<SquadreNelTurno> ListaSquadreNelTurno = new List<SquadreNelTurno>();

            string filepath = "Json/SquadreNelTurno.json";
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

        public static Squadra GetSquadraByCodice(string codiceSquadra, string codiceSede)
        {
            List<SquadreNelTurno> ListaSquadreNelTurno = new List<SquadreNelTurno>();

            string filepath = "Json/SquadreNelTurno.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaSquadreNelTurno = JsonConvert.DeserializeObject<List<SquadreNelTurno>>(json);

            Squadra squadraSel = new Squadra();

            foreach (SquadreNelTurno squadraNelTurno in ListaSquadreNelTurno.Where(x => x.CodiceSede == codiceSede).ToList())
            {
                foreach (Squadra squadra in squadraNelTurno.ListaSquadre)
                {
                    if (squadra.Codice.Equals(codiceSquadra))
                        squadraSel = squadra;
                }
            }

            return squadraSel;
        }
    }
}
