using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Utenti;
using SO115App.ExternalAPI.Fake.Classi;
using SO115App.ExternalAPI.Fake.Servizi.Identity;
using SO115App.ExternalAPI.Fake.Servizi.Identity.Mock;
using SO115App.ExternalAPI.Fake.Servizi.Personale.Mock;
using SO115App.Models.Classi.ServiziEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreBySede : IGetSquadreBySede
    {
        private readonly IGetPersonaFisica _getPersonaFisica;

        public GetSquadreBySede(IGetPersonaFisica getPersonaFisica)
        {
            _getPersonaFisica = getPersonaFisica;
        }

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                var listaSquadreTurno = new List<Turno>();
                var listaCodiciFiscali = new List<string>();

                var service = new SquadreNelTurnoService();
                var componentiService = new ComponentiSquadreService();

                foreach (var turno in service.GetListaSquadreBySede(codiceSede))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();

                        squadra.Componenti = componentiService.GetListaComponentiSquadra(codiceSede, squadra.Codice, turno.Codice);

                        var listaComponentiSquadra = _getPersonaFisica.Get(squadra.ListaCodiciFiscaliComponentiSquadra).Result;

                        foreach (var componente in squadra.Componenti)
                        {
                            foreach (var persona in listaComponentiSquadra)
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
