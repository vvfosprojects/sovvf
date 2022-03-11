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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class PreAccoppiatiQueryHandler : IQueryHandler<PreAccoppiatiQuery, PreAccoppiatiResult>
    {
        private readonly IGetPreAccoppiati _GetPreAccoppiati;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public PreAccoppiatiQueryHandler(IGetPreAccoppiati iGetPreAccoppiati, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _GetPreAccoppiati = iGetPreAccoppiati;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public PreAccoppiatiResult Handle(PreAccoppiatiQuery query)
        {
            Log.Debug("Inizio elaborazione Lista Preaccoppiati Composizione Handler");

            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();
            var pinNodi = new List<PinNodo>();

            foreach (var sede in query.CodiceSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
            }
            var listaSedi = listaSediAlberate.Result.GetSottoAlbero(pinNodi);
            foreach (var figlio in listaSedi)
            {
                pinNodi.Add(new PinNodo(figlio.Codice, true));
            }

            query.CodiceSede = pinNodi.Select(x => x.Codice).ToArray();

            var ListapreAccoppiati = _GetPreAccoppiati.GetAsync(query).Result;

            if (ListapreAccoppiati.Any(p => p.CodiceMezzo == null))
                return new PreAccoppiatiResult() { DataArray = new List<PreAccoppiato>()};

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
