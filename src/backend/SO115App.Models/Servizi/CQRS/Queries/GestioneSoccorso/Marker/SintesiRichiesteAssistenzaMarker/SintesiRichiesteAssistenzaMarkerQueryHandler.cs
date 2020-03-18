//-----------------------------------------------------------------------
// <copyright file="SintesiRichiesteAssistenzaMarkerQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Marker;

namespace SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker
{
    public class SintesiRichiesteAssistenzaMarkerQueryHandler : IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult>
    {
        private readonly IGetRichiesteMarker _iGetListaRichieste;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SintesiRichiesteAssistenzaMarkerQueryHandler(IGetRichiesteMarker iGetListaRichieste)
        {
            this._iGetListaRichieste = iGetListaRichieste;
        }

        /// <summary>
        ///   Metodo di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SintesiRichiesteAssistenzaMarkerResult Handle(SintesiRichiesteAssistenzaMarkerQuery query)
        {
            var sintesiRichiestaMarker = _iGetListaRichieste.GetListaRichiesteMarker(query);

            return new SintesiRichiesteAssistenzaMarkerResult()
            {
                SintesiRichiestaMarker = sintesiRichiestaMarker
            };
        }
    }
}
