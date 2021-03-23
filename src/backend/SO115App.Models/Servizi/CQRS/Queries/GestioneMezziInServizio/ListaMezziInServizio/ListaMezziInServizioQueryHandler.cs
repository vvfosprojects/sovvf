//-----------------------------------------------------------------------
// <copyright file="ListaMezziInServizioQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio
{
    public class ListaMezziInServizioQueryHandler : IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult>
    {
        private readonly IGetMezziInServizio _getListaMezzi;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        public ListaMezziInServizioQueryHandler(IGetMezziInServizio getListaMezzi, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getListaMezzi = getListaMezzi;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public ListaMezziInServizioResult Handle(ListaMezziInServizioQuery query)
        {
            var listaSediUtenteAbilitate = query.Operatore.Ruoli.Where(x => x.Descrizione.Equals(Costanti.GestoreRichieste)).ToHashSet();
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            /// <summary>
            ///Faccio gestire esclusivamente i Mezzi in Servizio delle Sedi nel quale l'operatore ha il ruolo di Gestore Richieste
            /// </summary>
            var pinNodi = listaSediUtenteAbilitate.Select(sede => new PinNodo(sede.CodSede, true)).ToList();

            /// <summary>
            ///   Aggiungo alla Sede principale gli eventuali sotto Nodi
            /// </summary>
            pinNodi.AddRange(listaSediAlberate.GetSottoAlbero(pinNodi).Select(figlio => new PinNodo(figlio.Codice, true)));

            var listaMezzi = _getListaMezzi.Get(query.CodiciSede) //FILTRI
                .Where(c =>
                {
                    if (query.Filters != null && query.Filters.StatiMezzo != null && query.Filters.StatiMezzo.Count() > 0)
                        return query.Filters.StatiMezzo.Contains(c.Mezzo.Mezzo.Stato);
                    else
                        return true;
                }).Where(c =>
                {
                    if (query.Filters != null && !string.IsNullOrEmpty(query.Filters.Search))
                        return c.Mezzo.Mezzo.Descrizione.Contains(query.Filters.Search)
                            || (c.Mezzo.Mezzo.IdRichiesta != null && c.Mezzo.Mezzo.IdRichiesta.Contains(query.Filters.Search));
                    else
                        return true;
                }).ToList();

            //GESTISCO PAGINAZIONE
            if (query.Pagination != null) return new ListaMezziInServizioResult()
            {
                DataArray = listaMezzi
                     .Skip(query.Pagination.PageSize * (query.Pagination.Page - 1))
                     .Take(query.Pagination.PageSize).ToList(),

                Pagination = new SO115App.Models.Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = listaMezzi.Count,
                }
            };
            else return new ListaMezziInServizioResult()
            {
                DataArray = listaMezzi
            };
        }
    }
}
