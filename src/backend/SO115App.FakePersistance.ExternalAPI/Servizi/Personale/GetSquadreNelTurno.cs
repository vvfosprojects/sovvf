//-----------------------------------------------------------------------
// <copyright file="GetSquadreNelTurno.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using System;
using System.Collections.Generic;
using System.Net.Http;

namespace SO115App.ExternalAPI.Fake.Personale
{
    public class GetSquadreNelTurno : IGetSquadreNelTurno
    {
        private readonly HttpClient _client;

        public GetSquadreNelTurno(HttpClient client)
        {
            _client = client;
        }

        public List<Turno> SquadreNelTurno(string codiceSede, string codiceTurno)
        {
            try
            {
                List<Turno> listaSquadreTurno = new List<Turno>();
                var response = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/GetSquadreNelTurno/codiceSede={0}&codiceTurno={1}", codiceSede, codiceTurno));
                foreach (var turno in JsonConvert.DeserializeObject<List<Turno>>(response.ToString()))
                {
                    foreach (var squadra in turno.ListaSquadre)
                    {
                        squadra.Componenti = new List<Componente>();
                        var responseComponenti = _client.GetStringAsync(string.Format(Costanti.ServiziGetSquadreUrl + "/codiceSede={0}&codiceSquadra={1}&codiceTurno={2}", codiceSede, squadra.Codice, turno.Codice));
                        squadra.Componenti = JsonConvert.DeserializeObject<List<Componente>>(responseComponenti.ToString());
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
