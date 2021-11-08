//-----------------------------------------------------------------------
// <copyright file="GetPOSByIdQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using System.IO;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneDocumentale.GetDocById
{
    /// <summary>
    ///   Servizio che si occupa del reperimento delle POS
    /// </summary>
    public class GetDocByIdQueryHandler : IQueryHandler<GetDocByIdQuery, GetDocByIdResult>
    {
        private readonly IGetDoc _getDoc;

        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        public GetDocByIdQueryHandler(IGetDoc getDoc)
        {
            _getDoc = getDoc;
        }

        /// <summary>
        ///   metodo della classe che si occupa del handling della query.
        /// </summary>
        /// <param name="query">la query in ingresso</param>
        /// <returns>il risultato della query</returns>
        public GetDocByIdResult Handle(GetDocByIdQuery query)
        {
            var documento = _getDoc.GetDocById(query.IdDoc);

            MemoryStream ms = new MemoryStream(documento.FDFile);

            return new GetDocByIdResult()
            {
                FdFile = ms
            };
        }
    }
}
