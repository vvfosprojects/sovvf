﻿//-----------------------------------------------------------------------
// <copyright file="ListaMezziInServizioQuery.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio
{
    /// <summary>
    ///   DTO di input
    /// </summary>
    public class ListaMezziInServizioQuery : IQuery<ListaMezziInServizioResult>
    {
        public FiltriListaMezziInServizio Filters { get; set; }
        public Paginazione Pagination { get; set; }

        public string[] CodiciSede { get; set; }
        public string IdOperatore { get; set; }
        public Utente Operatore { get; set; }
    }
}
