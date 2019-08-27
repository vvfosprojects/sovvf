//-----------------------------------------------------------------------
// <copyright file="ComposizioneMezziQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizioneMezziQueryHandler : IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult>
    {
        private readonly IGetComposizioneMezzi _iGetComposizioneMezzi;

        public ComposizioneMezziQueryHandler(IGetComposizioneMezzi iGetComposizioneMezzi)
        {
            this._iGetComposizioneMezzi = iGetComposizioneMezzi;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizioneMezziResult Handle(ComposizioneMezziQuery query)
        {
            // preparazione del DTO
            var composizioneMezzi = _iGetComposizioneMezzi.Get(query);

            return new ComposizioneMezziResult()
            {
                ComposizioneMezzi = composizioneMezzi
            };
        }
    }
}
