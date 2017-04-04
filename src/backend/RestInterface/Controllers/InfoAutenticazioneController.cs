//-----------------------------------------------------------------------
// <copyright file="InfoAutenticazioneController.cs" company="CNVVF">
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
using System.Web.Http;
using Modello.Servizi.Infrastruttura.Autenticazione;
using RestInterface.Models;

namespace RestInterface.Controllers
{
    /// <summary>
    ///   Controller che restituisce i dati sull'autenticazione dell'utente
    /// </summary>
    public class InfoAutenticazioneController : ApiController
    {
        /// <summary>
        ///   Istanza del servizio che restituisce la username dell'operatore autenticato
        /// </summary>
        private readonly IGetOperatoreAutenticato getOperatoreAutenticato;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getOperatoreAutenticato">Istanza del servizio iniettato</param>
        public InfoAutenticazioneController(
            IGetOperatoreAutenticato getOperatoreAutenticato)
        {
            this.getOperatoreAutenticato = getOperatoreAutenticato;
        }

        /// <summary>
        ///   Restituisce le informazioni sull'operatore autenticato
        /// </summary>
        /// <returns>Le informazioni sull'utente autenticato</returns>
        public InfoUtenteAutenticato Get()
        {
            // preleva username dell'operatore autenticato
            var username = this.getOperatoreAutenticato.Get();

            // una volta avuta la username, usiamo altro servizio per recuperare i dati anagrafici
            // per username: var nominativo = servizio2.Get(username);
            return new InfoUtenteAutenticato()
            {
                Username = username,
                IstanteAutenticazione = DateTime.Now.AddHours(-3)
            };
        }
    }
}
