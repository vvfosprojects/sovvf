//-----------------------------------------------------------------------
// <copyright file="GetSquadreBySede.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
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

        public GetSquadreBySede(HttpClient client)
        {
            _client = client;
        }

        public List<Turno> SquadreBySede(string codiceSede)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                GetPersonaFisica Identity = new GetPersonaFisica(_client);
                List<string> ListaCodiciFiscali = new List<string>();
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
