//-----------------------------------------------------------------------
// <copyright file="BoxMezziQuery.cs" company="CNVVF">
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
using CQRS.Queries;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneUtente.LogIn
{
    /// <summary>
    /// DTO che alimenta il Box Mezzi presente in Home Page
    /// </summary>
    public class LogInQuery : IQuery<LogInResult>
    {
        /// <summary>
        /// Filtra solo i mezzi appartenenti all'unità operativa indicata.
        /// </summary>
        /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
        public string Username { get; set; }

        public string Password { get; set; }
    }
}