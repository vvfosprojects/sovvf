//-----------------------------------------------------------------------
// <copyright file="GetAllBlocksHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneConcorrenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneConcorrenza
{
    public class GetAllBlocksHandler : IQueryHandler<GetAllBlocksQuery, GetAllBlocksResult>
    {
        private readonly IGetAllBlocks _getAllBlocks;
        private readonly IGetAlberaturaUnitaOperative _getAlberaturaUnitaOperative;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public GetAllBlocksHandler(IGetAllBlocks getAllBlocks, IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _getAllBlocks = getAllBlocks;
            _getAlberaturaUnitaOperative = getAlberaturaUnitaOperative;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public GetAllBlocksResult Handle(GetAllBlocksQuery query)
        {
            var listaSediAlberate = _getAlberaturaUnitaOperative.ListaSediAlberata();

            var pinNodi = new List<PinNodo>();
            var pinNodiNoDistaccamenti = new List<PinNodo>();

            foreach (var sede in query.CodiciSede)
            {
                pinNodi.Add(new PinNodo(sede, true));
                pinNodiNoDistaccamenti.Add(new PinNodo(sede, true));
            }

            foreach (var figlio in listaSediAlberate.Result.GetSottoAlbero(pinNodi))
                pinNodi.Add(new PinNodo(figlio.Codice, true));

            query.CodiciSede = pinNodi.Select(p => p.Codice).Distinct().ToArray();

            return new GetAllBlocksResult()
            {
                BlocksList = _getAllBlocks.GetAll(query.CodiciSede)
            };
        }
    }
}
