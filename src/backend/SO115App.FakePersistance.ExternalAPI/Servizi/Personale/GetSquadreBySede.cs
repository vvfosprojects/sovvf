using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreBySede : IGetSquadreBySede
    {
        private readonly HttpClient _client;

        public GetSquadreBySede(HttpClient client)
        {
            _client = client;
        }

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                var response = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/GetSquadreBySede?codiceSede={0}", codiceSede));
                foreach (var turno in JsonConvert.DeserializeObject<List<Turno>>(response.ToString()))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.ListaComponenti = new List<Componente>();
                        var responseComponenti = _client.GetStringAsync(string.Format(Costanti.ServiziGetComponentiUrl + "?codiceSede={0}&codiceSquadra={1}&codiceTurno={2}", codiceSede, squadra.Codice, turno.Codice));
                        squadra.ListaComponenti = JsonConvert.DeserializeObject<List<Componente>>(responseComponenti.ToString());
                        foreach (var componente in squadra.ListaComponenti)
                        {
                            var responseNominativiComponenti = _client.GetStringAsync(string.Format(Costanti.IdentityManagementUrl + "?codiciFiscali={0}", componente.CodiceFiscale));
                            var compo = JsonConvert.DeserializeObject<List<Componente>>(responseNominativiComponenti.ToString());
                            componente.Nominativo = compo[0].Nominativo;
                        }
                    }
                    listaSquadreTurno.Add(turno);
                }

                return listaSquadreTurno;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}
