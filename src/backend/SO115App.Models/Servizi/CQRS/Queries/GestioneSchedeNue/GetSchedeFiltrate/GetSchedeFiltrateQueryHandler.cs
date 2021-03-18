//-----------------------------------------------------------------------
// <copyright file="ListaSchedeContattoQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeFiltrate
{
    internal class GetSchedeFiltrateQueryHandler : IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult>
    {
        private readonly IGetSchedeFiltrate _getSchedeFiltrate;
        private readonly IGetUtenteById _getUtenteBy;

        public GetSchedeFiltrateQueryHandler(IGetSchedeFiltrate getSchedeFiltrate, IGetUtenteById getUtenteBy)
        {
            _getSchedeFiltrate = getSchedeFiltrate;
            _getUtenteBy = getUtenteBy;
        }

        public GetSchedeFiltrateResult Handle(GetSchedeFiltrateQuery query)
        {
            string codiceFiscale = null;
            //if (query.Filters.CercaPerOperatore == true)
            //{
            //var utente = _getUtenteBy.GetUtenteByCodice(query.IdUtente);
            //codiceFiscale = utente.CodiceFiscale;
            //}

            var listaSchedeContatto = new List<SchedaContatto>();

            query.CodiciSede.ToList().ForEach(codice => 
                listaSchedeContatto.AddRange(_getSchedeFiltrate.Get(query.Filters.Search, query.Filters.Gestita, codiceFiscale, query.Filters.RangeVisualizzazione, codice)));

            var result = listaSchedeContatto.OrderByDescending(x => !x.Gestita).ThenByDescending(x => x.Priorita).ThenBy(x => x.DataInserimento).ToList();

            return new GetSchedeFiltrateResult()
            {
                DataArray = result
                    .Skip((query.Pagination.Page - 1) * query.Pagination.PageSize)
                    .Take(query.Pagination.PageSize).ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = result.Count
                }
            };
        }
    }
}
