﻿using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi;
using System.Collections.Generic;
using System.IO;

namespace SO115App.ExternalAPI.Fake.Servizi.Identity.Mock
{
    public class AnagraficaPersonaleService
    {
        public static List<Componente> GetListaComponentiSquadra(string[] ListaCodiciFiscali)
        {
            List<Componente> ListaComponenti = new List<Componente>();
            List<Componente> ListaDef = new List<Componente>();

            string filepath = Costanti.IdentityManagementJson;
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
