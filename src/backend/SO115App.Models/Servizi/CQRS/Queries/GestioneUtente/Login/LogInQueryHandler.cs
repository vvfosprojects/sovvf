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
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CQRS.Queries;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneUtente.LogIn
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class LogInQueryHandler : IQueryHandler<LogInQuery, LogInResult>
    {
        private readonly IConfiguration _config;

        public LogInQueryHandler(IConfiguration config)
        {
            this._config = config;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public LogInResult Handle(LogInQuery query)
        {
            // preparazione del DTO
            var utente = Utente.VerificaLogIn(query.Username, query.Password);

            var claim = new[]
                {
                    new Claim(ClaimTypes.NameIdentifier, utente.Id.ToString()),
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

            return new LogInResult()
            {
                User = utente
            };
        }
    }
}
