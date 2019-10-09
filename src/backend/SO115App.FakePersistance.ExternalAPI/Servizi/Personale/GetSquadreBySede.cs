using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreBySede : IGetSquadreBySede
    {
        private HttpClient client = new HttpClient();

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                List<Turno> ListaSquadreTurno = new List<Turno>();
                var response = client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/GetSquadreBySede?codiceSede={0}", codiceSede));
                var ListTurno = JsonConvert.DeserializeObject<List<Turno>>(response.ToString());

                foreach (var turno in ListTurno)
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        List<Componente> ListaComponenti = new List<Componente>();
                        squadra.ListaComponenti = new List<Componente>();
                        var responseComponenti = client.GetStringAsync(string.Format(Costanti.ServiziGetComponentiUrl + "?codiceSede={0}&codiceSquadra={1}&codiceTurno={2}", codiceSede, squadra.Codice, turno.Codice));
                        ListaComponenti = JsonConvert.DeserializeObject<List<Componente>>(responseComponenti.ToString());
                        squadra.ListaComponenti = ListaComponenti;
                        foreach (var componente in squadra.ListaComponenti)
                        {
                            List<Componente> compo = new List<Componente>();
                            var responseNominativiComponenti = client.GetStringAsync(string.Format(Costanti.IdentityManagementUrl + "?codiciFiscali={0}", componente.CodiceFiscale));
                            compo = JsonConvert.DeserializeObject<List<Componente>>(responseNominativiComponenti.ToString());
                            componente.Nominativo = compo[0].Nominativo;
                        }
                    }
                    ListaSquadreTurno.Add(turno);
                }

                return ListaSquadreTurno;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
