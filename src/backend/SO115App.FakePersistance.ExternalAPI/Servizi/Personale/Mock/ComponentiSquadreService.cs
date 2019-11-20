using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.ExternalAPI.Fake.Classi;
using System.Collections.Generic;
using System.IO;
using System.Reflection;

namespace SO115App.ExternalAPI.Fake.Servizi.Personale.Mock
{
    public class ComponentiSquadreService
    {
        private readonly string ComponentiJson = Path.Combine(Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location), Costanti.ServiziComponentiJson);

        public List<Componente> GetListaComponentiSquadra(string codiceSede, string codiceSquadra, string codiceTurno)
        {
            var SquadreService = new SquadreNelTurnoService();

            var squadra = SquadreService.GetSquadraByCodice(codiceSquadra, codiceSede, codiceTurno);

            var ListaDef = new List<Componente>();

            string json;
            using (StreamReader r = new StreamReader(ComponentiJson))
            {
                json = r.ReadToEnd();
            }

            var listaComponenti = JsonConvert.DeserializeObject<List<Componente>>(json);

            foreach (var cf in squadra.ListaCodiciFiscaliComponentiSquadra)
            {
                foreach (var compo in listaComponenti)
                {
                    if (compo.CodiceFiscale.Equals(cf))
                        ListaDef.Add(compo);
                }
            }

            return ListaDef;
        }
    }
}
