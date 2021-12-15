//-----------------------------------------------------------------------
// <copyright file="ComposizioneSquadreQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.ComposizioneSquadre
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class ComposizioneSquadreQueryHandler : IQueryHandler<ComposizioneSquadreQuery, ComposizioneSquadreResult>
    {
        private readonly ISetComposizioneSquadre _setSquadreDB;
        private readonly IGetComposizioneSquadreDB _getSquadreDB;
        private readonly IGetComposizioneSquadre _getSquadre;

        private const string msgErroreCaricamento = "Errore caricamento elenco squadre";

        public ComposizioneSquadreQueryHandler(IGetComposizioneSquadre getSquadre, ISetComposizioneSquadre set, IGetComposizioneSquadreDB getSquadreDB)
        {
            _getSquadre = getSquadre;
            _setSquadreDB = set;
            _getSquadreDB = getSquadreDB;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public ComposizioneSquadreResult Handle(ComposizioneSquadreQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Squadre Composizione Handler");

            List<ComposizioneSquadra> composizioneSquadre = null;

            try
            {
                composizioneSquadre = _getSquadre.Get(query);

                if (composizioneSquadre != null && composizioneSquadre.Count > 0)
                    _setSquadreDB.Set(composizioneSquadre);

                if (composizioneSquadre == null || composizioneSquadre.Count == 0)
                    composizioneSquadre = _getSquadreDB.Get();
            }
            catch
            {
                if (composizioneSquadre == null || composizioneSquadre.Count == 0)
                    composizioneSquadre = _getSquadreDB.Get();

                if (composizioneSquadre == null || composizioneSquadre.Count == 0)
                    throw new Exception(msgErroreCaricamento);
            }

            Log.Debug("Fine elaborazione Lista Squadre Composizione Handler");

            return new ComposizioneSquadreResult()
            {
                DataArray = composizioneSquadre
                    .Skip((query.Filtro.Pagination.Page - 1) * query.Filtro.Pagination.PageSize)
                    .Take(query.Filtro.Pagination.PageSize)
                    .ToList(),
                Pagination = new SO115App.Models.Classi.Condivise.Paginazione()
                {
                    Page = query.Filtro.Pagination.Page,
                    PageSize = query.Filtro.Pagination.PageSize,
                    TotalItems = composizioneSquadre.Count
                }
            };
        }
    }
}
