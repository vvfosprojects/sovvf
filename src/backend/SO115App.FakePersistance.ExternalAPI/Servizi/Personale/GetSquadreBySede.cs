using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Servizi.Identity;
using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreBySede : IGetSquadreBySede
    {
        private readonly HttpClient _client;
        private readonly IConfiguration configuration;

        public GetSquadreBySede(HttpClient client, IConfiguration configuration)
        {
            _client = client;
            this.configuration = configuration;
        }

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                GetPersonaFisica Identity = new GetPersonaFisica(_client, configuration);
                List<string> ListaCodiciFiscali = new List<string>();

                var ExternalUrlString = configuration.GetSection("UrlExternalApi").GetSection("ServiziApi").Value;

                var response = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/GetSquadreBySede?codiceSede={0}", codiceSede));
                foreach (var turno in JsonConvert.DeserializeObject<List<Turno>>(response.ToString()))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();
                        var responsecomponenti = _client.GetStringAsync(string.Format(Costanti.ServiziGetComponentiUrl + "?codicesede={0}&codicesquadra={1}&codiceturno={2}", codiceSede, squadra.Codice, turno.Codice));
                        squadra.Componenti = JsonConvert.DeserializeObject<List<Componente>>(responsecomponenti.ToString());

                        List<PersonaFisica> ListaComponentiSquadra = new List<PersonaFisica>();

                        ListaComponentiSquadra = Identity.Get(squadra.ListaCodiciFiscaliComponentiSquadra);

                        foreach (var componente in squadra.Componenti)
                        {
                            foreach (var persona in ListaComponentiSquadra)
                            {
                                if (persona.CodFiscale.Equals(componente.CodiceFiscale))
                                {
                                    componente.Nominativo = persona.Nome + " " + persona.Cognome;
                                    //MANCANO QUALIFICA LUNGA E BREVE
                                }
                            }
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
