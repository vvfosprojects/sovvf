//-----------------------------------------------------------------------
// <copyright file="ChiamataController.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata;
using Modello.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata.CommandDTO;

namespace RestInterface.Controllers.Soccorso
{
    /// <summary>
    ///   Controller relativo alla segnalazione chiamata
    /// </summary>
    public class ChiamataController : ApiController
    {
        /// <summary>
        ///   Istanza del command
        /// </summary>
        private readonly InserisciTelefonataCommandHandler handler;

        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="handler">L'handler del command</param>
        public ChiamataController(InserisciTelefonataCommandHandler handler)
        {
            this.handler = handler;
        }

        /// <summary>
        ///   Inserisce una nuova telefonata creando una richiesta di assistenza
        /// </summary>
        /// <param name="command">Il DTO</param>
        public void Post([FromBody] InserisciTelefonataCommand command)
        {
            this.handler.Handle(command);
        }
    }
}
