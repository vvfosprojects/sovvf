//-----------------------------------------------------------------------
// <copyright file="GetElencoPOSQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Pos;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestionePOS.RicercaElencoPOS
{
    /// <summary>
    ///   Servizio che si occupa del reperimento delle POS
    /// </summary>
    public class GetElencoPOSQueryHandler : IQueryHandler<GetElencoPOSQuery, GetElencoPOSResult>
    {
        private readonly IGetPOS _getPOS;

        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        public GetElencoPOSQueryHandler(IGetPOS getPOS)
        {
            _getPOS = getPOS;
        }

        /// <summary>
        ///   metodo della classe che si occupa del handling della query.
        /// </summary>
        /// <param name="query">la query in ingresso</param>
        /// <returns>il risultato della query</returns>
        public GetElencoPOSResult Handle(GetElencoPOSQuery query)
        {
            var lstPOS = _getPOS.Get(query);

            List<PosDAO> lstPOSPaginata = null;

            if (query.Pagination != default)
            {
                lstPOSPaginata = lstPOS.Skip((query.Pagination.Page - 1) * query.Pagination.PageSize).Take(query.Pagination.PageSize).ToList();
                query.Pagination.TotalItems = lstPOS.Count;
            }
            else lstPOSPaginata = lstPOS;

            return new GetElencoPOSResult()
            {
                DataArray = lstPOSPaginata,
                Pagination = query.Pagination
            };
        }
    }
}
