//-----------------------------------------------------------------------
// <copyright file="GetElencoDocResult.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Documentale;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.RicercaElencoDoc
{
    /// <summary>
    ///   Modello di uscita della query del documentale
    /// </summary>
    public class GetElencoDocResult
    {
        /// <summary>
        ///   La lista delle POS in uscita dalla query.
        /// </summary>
        public List<DaoDocumentale> DataArray { get; set; }

        public Paginazione Pagination { get; set; }
    }
}
