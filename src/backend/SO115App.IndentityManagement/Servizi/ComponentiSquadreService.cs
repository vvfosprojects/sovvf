using Newtonsoft.Json;
using SO115App.ApiIndentityManagement;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace SO115App.ApiIndentityManagement.Servizi
{
    public class ComponentiSquadreService
    {
        public static List<Componente> GetListaComponentiSquadra(string[] ListaCodiciFiscali)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            List<Componente> ListaDef = new List<Componente>();

            string filepath = "Json/Componenti.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();
            }

            ListaComponenti = JsonConvert.DeserializeObject<List<Componente>>(json);

            foreach (var cf in ListaCodiciFiscali)
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
