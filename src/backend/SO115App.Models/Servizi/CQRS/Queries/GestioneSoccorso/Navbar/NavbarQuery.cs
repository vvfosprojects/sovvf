﻿//-----------------------------------------------------------------------
// <copyright file="NavbarQuery.cs" company="CNVVF">
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

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Navbar
{
    /// <summary>
    ///   DTO che alimenta il Navbar presente in Home Page
    /// </summary>
    public class NavbarQuery : IQuery<NavbarResult>
    {
        /// <summary>
        ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
        /// </summary>
        /// <remarks>Eventualmente si può filtrare per cercare solo i dati di un singolo Box</remarks>
        public string FiltroBox { get; set; }

        /// <summary>
        ///   L'id utente loggato
        /// </summary>
        public string IdUtente { get; set; }

        public string[] CodSedi { get; set; }
    }
}
