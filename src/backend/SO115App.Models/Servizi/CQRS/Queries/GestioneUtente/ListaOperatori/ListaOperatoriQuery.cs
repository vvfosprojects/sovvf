//-----------------------------------------------------------------------
// <copyright file="ListaOperatoriQuery.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Filtri;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.ListaOperatori
{
    /// <summary>
    ///   la query con i parametri utili per la ricerca della lista personale
    /// </summary>
    public class ListaOperatoriQuery : IQuery<ListaOperatoriResult>
    {
        /// <summary>
        ///   il codice sede nell'header
        /// </summary>
        public string CodiciSede { get; set; }

        /// <summary>
        ///   l'id utente che richiede la lista degli operatori di sala
        /// </summary>
        public string IdUtente { get; set; }

        /// <summary>
        ///   l'oggetto paginazione con i parametri utili per la paginazione
        /// </summary>
        public Paginazione Pagination { get; set; }

        /// <summary>
        ///   i filtri per la lista degli operatori
        /// </summary>
        public FiltriUtenti Filters { get; set; }
    }
}
