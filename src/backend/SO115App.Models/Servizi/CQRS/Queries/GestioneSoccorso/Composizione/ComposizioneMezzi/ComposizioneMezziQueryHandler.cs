﻿//-----------------------------------------------------------------------
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
using CQRS.Queries;
using Serilog;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneMezzi
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizioneMezziQueryHandler : IQueryHandler<ComposizioneMezziQuery, ComposizioneMezziResult>
    {
        private readonly IGetComposizioneMezzi _iGetComposizioneMezzi;

        private const string msgErroreCaricamento = "Errore caricamento elenco mezzi";

        public ComposizioneMezziQueryHandler(IGetComposizioneMezzi iGetComposizioneMezzi)
        {
            _iGetComposizioneMezzi = iGetComposizioneMezzi;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizioneMezziResult Handle(ComposizioneMezziQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Mezzi per Composizione Handler");

            List<Classi.Composizione.ComposizioneMezzi> composizioneMezzi = null;

            try
            {
                composizioneMezzi = _iGetComposizioneMezzi.Get(query);
            }
            catch (Exception e)
            {
                e = e.GetBaseException();

                throw new Exception($"{msgErroreCaricamento}: {e.Message}.\n\n{e.StackTrace}");
            }

            Log.Debug("Fine elaborazione Lista Mezzi per Composizione Handler");

            return new ComposizioneMezziResult()
            {
                DataArray = composizioneMezzi
                    .Skip((query.Pagination.Page - 1) * query.Pagination.PageSize)
                    .Take(query.Pagination.PageSize).ToList(),
                Pagination = new SO115App.Models.Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = composizioneMezzi.Count
                }
            };
        }
    }
}
