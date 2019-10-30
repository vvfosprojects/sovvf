using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi.Servizi;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale.Mock
{
    public class ComponentiSquadreService
    {
        public static List<Componente> GetListaComponentiSquadra(string codiceSede, string codiceSquadra, string codiceTurno)
        {
            SquadraDTO squadra = SquadreNelTurnoService.GetSquadraByCodice(codiceSquadra, codiceSede, codiceTurno);

            List<Componente> ListaComponenti = new List<Componente>();
            List<Componente> ListaDef = new List<Componente>();

            string filepath = Costanti.ServiziComponentiJson;
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
