//-----------------------------------------------------------------------
// <copyright file="LogInQueryHandler.cs" company="CNVVF">
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
using CQRS.Authorization;
using CQRS.Queries;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Serilog;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Utenti.Autenticazione;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneUtente.CasLogin
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class CasLoginQueryHandler : IQueryHandler<CasLoginQuery, CasLoginResult>
    {
        private readonly HttpClient _client;
        private readonly IConfiguration _config;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public CasLoginQueryHandler(HttpClient client, IConfiguration config, IGetUtenteByCF getUtenteByCF)
        {
            _client = client;
            _config = config;
            _getUtenteByCF = getUtenteByCF;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public CasLoginResult Handle(CasLoginQuery query)
        {
            var Cas = CheckCasTicket(query).Result;

            Log.Information($"Risposta = {Cas.serviceResponse.AuthenticationSuccess}");

            if (Cas.serviceResponse.AuthenticationFailure != null)
            {
                return new CasLoginResult()
                {
                    User = null
                };
            }

            Log.Information($"Attributi = {Cas.serviceResponse.AuthenticationSuccess}");

            if (Cas.serviceResponse.AuthenticationSuccess != null)
            {
                Log.Information($"Attributi Login= {Cas.serviceResponse.AuthenticationSuccess}");
                string CodFiscale;

                if (Cas.serviceResponse.AuthenticationSuccess.Attributes.sAMAccountName != null)
                    CodFiscale = Cas.serviceResponse.AuthenticationSuccess.Attributes.sAMAccountName[0];
                else
                    CodFiscale = Cas.serviceResponse.AuthenticationSuccess.User;

                var utente = _getUtenteByCF.Get(CodFiscale);
                if (utente == null)
                    return new CasLoginResult()
                    {
                        User = null
                    };

                var claim = new[]
                    {
                    new Claim(ClaimTypes.NameIdentifier, utente.CodiceFiscale.ToString()),
                    new Claim(ClaimTypes.Name,utente.Username)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claim),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);

                utente.Token = tokenHandler.WriteToken(token);

                return new CasLoginResult()
                {
                    User = utente
                };
            }
            else
            {
                var utente = _getUtenteByCF.Get(Cas.serviceResponse.AuthenticationSuccess.Id);
                if (utente == null)
                    return new CasLoginResult()
                    {
                        User = null
                    };

                var claim = new[]
                    {
                    new Claim(ClaimTypes.NameIdentifier, utente.CodiceFiscale.ToString()),
                    new Claim(ClaimTypes.Name,utente.Username)
                };

                var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

                var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claim),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = creds
                };

                var tokenHandler = new JwtSecurityTokenHandler();

                var token = tokenHandler.CreateToken(tokenDescriptor);

                utente.Token = tokenHandler.WriteToken(token);

                return new CasLoginResult()
                {
                    User = utente
                };
            }
        }

        public async Task<CasResponse> CheckCasTicket(CasLoginQuery query)
        {
            _client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("test");
            var response = await _client.GetAsync($"{_config.GetSection("CasURL").Value}serviceValidate?service={query.Service}&format=JSON&ticket={query.Ticket}").ConfigureAwait(false);
            response.EnsureSuccessStatusCode();
            using HttpContent content = response.Content;
            var data = await content.ReadAsStringAsync().ConfigureAwait(false);

            Log.Information($"CAS - Risposta = {data}");

            var RispostaCas = JsonConvert.DeserializeObject<CasResponse>(data);

            Log.Information($"CAS - JSON = {data}");

            return RispostaCas;
        }
    }
}
