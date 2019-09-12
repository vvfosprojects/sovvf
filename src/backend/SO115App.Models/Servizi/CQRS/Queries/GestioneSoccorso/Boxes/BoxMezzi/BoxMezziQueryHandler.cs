//-----------------------------------------------------------------------
// <copyright file="BoxMezziQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Box;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class BoxMezziQueryHandler : IQueryHandler<BoxMezziQuery, BoxMezziResult>
    {
        private readonly IGetBoxMezzi _iGetbox;

        public BoxMezziQueryHandler(IGetBoxMezzi iGetbox)
        {
            this._iGetbox = iGetbox;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public BoxMezziResult Handle(BoxMezziQuery query)
        {
            // preparazione del DTO
            var boxes = _iGetbox.Get(query.CodiceSede);

            return new BoxMezziResult()
            {
                BoxMezzi = boxes
            };
        }
    }
}
