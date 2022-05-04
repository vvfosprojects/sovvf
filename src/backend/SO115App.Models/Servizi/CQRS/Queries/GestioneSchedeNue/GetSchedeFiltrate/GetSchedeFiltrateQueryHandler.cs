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
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.Utility;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeFiltrate
{
    internal class GetSchedeFiltrateQueryHandler : IQueryHandler<GetSchedeFiltrateQuery, GetSchedeFiltrateResult>
    {
        private readonly IGetSchedeFiltrate _getSchedeFiltrate;
        private readonly IGetSottoSediByCodSede _getSottoSedi;

        public GetSchedeFiltrateQueryHandler(IGetSchedeFiltrate getSchedeFiltrate, IGetSottoSediByCodSede getSottoSedi)
        {
            _getSchedeFiltrate = getSchedeFiltrate;
            _getSottoSedi = getSottoSedi;
        }

        public GetSchedeFiltrateResult Handle(GetSchedeFiltrateQuery query)
        {
            var lstSedi = _getSottoSedi.Get(query.CodiciSede);

            var listaSchedeContatto = new ConcurrentBag<SchedaContatto>();

            Parallel.ForEach(lstSedi, sede =>
            {
                var lstSchedeSede = _getSchedeFiltrate.Get(query.Filters.Search, query.Filters.Gestita, null, query.Filters.RangeVisualizzazione, sede, query.Filters.Classificazione, sede);

                lstSchedeSede.ForEach(s => listaSchedeContatto.Add(s));
            });

            var result = listaSchedeContatto.ToList();

            if (query.Pagination.Page != 0)
            {
                result = listaSchedeContatto
                    .Skip((query.Pagination.Page - 1) * query.Pagination.PageSize)
                    .Take(query.Pagination.PageSize).ToList();
            }

            result = result.OrderByDescending(s => s.DataInserimento).ToList();

            return new GetSchedeFiltrateResult()
            {
                DataArray = result.ToList(),

                Pagination = new Classi.Condivise.Paginazione()
                {
                    Page = query.Pagination.Page,
                    PageSize = query.Pagination.PageSize,
                    TotalItems = listaSchedeContatto.Count
                }
            };
        }
    }
}
