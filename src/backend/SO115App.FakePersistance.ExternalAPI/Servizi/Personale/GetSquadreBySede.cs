using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Identity;
using SO115App.ExternalAPI.Fake.Servizi.Identity.Mock;
using SO115App.ExternalAPI.Fake.Servizi.Personale.Mock;
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
        private readonly IConfiguration _configuration;
        private readonly AnagraficaPersonaleService _componentiSquadre;

        public GetSquadreBySede(HttpClient client, IConfiguration configuration, AnagraficaPersonaleService componentiSquadre)
        {
            _client = client;
            this._configuration = configuration;
            this._componentiSquadre = componentiSquadre;
        }

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                GetPersonaFisica Identity = new GetPersonaFisica(_client, _configuration);
                List<string> ListaCodiciFiscali = new List<string>();

                SquadreNelTurnoService service = new SquadreNelTurnoService();
                ComponentiSquadreService componentiService = new ComponentiSquadreService();

                foreach (var turno in service.GetListaSquadreBySede(codiceSede))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();

                        squadra.Componenti = componentiService.GetListaComponentiSquadra(codiceSede, squadra.Codice, turno.Codice);

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
