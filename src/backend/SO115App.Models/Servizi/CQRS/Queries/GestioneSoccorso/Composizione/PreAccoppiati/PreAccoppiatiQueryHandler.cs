//-----------------------------------------------------------------------
// <copyright file="PreAccoppiatiQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class PreAccoppiatiQueryHandler : IQueryHandler<PreAccoppiatiQuery, PreAccoppiatiResult>
    {
        private readonly IGetPreAccoppiati _GetPreAccoppiati;

        public PreAccoppiatiQueryHandler(IGetPreAccoppiati iGetPreAccoppiati) => _GetPreAccoppiati = iGetPreAccoppiati;

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public PreAccoppiatiResult Handle(PreAccoppiatiQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Preaccoppiati Composizione Handler");

            var ListapreAccoppiati = _GetPreAccoppiati.GetAsync(query).Result;

            if (query.Filtri.TipoMezzo != null)
            {
                ListapreAccoppiati = ListapreAccoppiati.FindAll(m => m.GenereMezzo.Equals(query.Filtri.TipoMezzo));
            }

            if (query.Filtri.StatoMezzo != null)
            {
                ListapreAccoppiati = ListapreAccoppiati.FindAll(m => query.Filtri.StatoMezzo.Any(s => s.Equals(m.StatoMezzo)));
            }

            Log.Debug("Fine elaborazione Lista Preaccoppiati Composizione Handler");

            return new PreAccoppiatiResult()
            {
                DataArray = ListapreAccoppiati
                    .Skip(query.Filtri.Pagination.PageSize * (query.Filtri.Pagination.Page - 1))
                    .Take(query.Filtri.Pagination.PageSize).ToList(),

                Pagination = new Paginazione()
                {
                    Page = query.Filtri.Pagination.Page,
                    PageSize = query.Filtri.Pagination.PageSize,
                    TotalItems = ListapreAccoppiati.Count
                }
            };
        }
    }
}
