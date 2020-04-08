using Newtonsoft.Json;
using SO115App.ApiServizi.Classi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiServizi.Servizi
{
    public class ComponentiSquadreService
    {
        public static List<Componente> GetListaComponentiSquadra(string codiceSede, string codiceSquadra, string codiceTurno)
        {
            SquadraDTO squadra = SquadreNelTurnoService.GetSquadraByCodice(codiceSquadra, codiceSede, codiceTurno);

            List<Componente> ListaComponenti = new List<Componente>();
            List<Componente> ListaDef = new List<Componente>();

            string filepath = "Json/Componenti.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaComponenti = JsonConvert.DeserializeObject<List<Componente>>(json);

            foreach (var cf in squadra.ListaCodiciFiscaliComponentiSquadra)
            {
                foreach (var compo in ListaComponenti)
                {
                    if (compo.CodiceFiscale.Equals(cf))
                        ListaDef.Add(compo);
                }
            }

            return ListaDef;
        }
    }
}
