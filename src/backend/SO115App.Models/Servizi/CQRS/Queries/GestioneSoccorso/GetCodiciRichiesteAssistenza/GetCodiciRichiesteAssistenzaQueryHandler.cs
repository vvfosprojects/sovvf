//-----------------------------------------------------------------------
// <copyright file="SintesiRichiestaAssistenzaQueryHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetCodiciRichiesteAssistenza
{
    /// <summary>
    ///   Restituisce una Richiesta di assistenza per un IdRichiesta
    /// </summary>
    public class GetCodiciRichiesteAssistenzaQueryHandler : IQueryHandler<GetCodiciRichiesteAssistenzaQuery, GetCodiciRichiesteAssistenzaResult>
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiestaById _getRichiestaAssistenzaById;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getRichiestaAssistenzaById">Istanza del servizio <see cref="IGetSintesiRichiestaAssistenzaByCodice" /></param>
        public GetCodiciRichiesteAssistenzaQueryHandler(
                IGetRichiestaById getRichiestaAssistenzaById)
        {
            _getRichiestaAssistenzaById = getRichiestaAssistenzaById;
        }

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public GetCodiciRichiesteAssistenzaResult Handle(GetCodiciRichiesteAssistenzaQuery query)
        {
            Log.Debug("Inizio elaborazione Sintesi Richiesta by Codice Richiesta Handler");

            // estrae la richieste di assistenza indicata
            var richiesta = _getRichiestaAssistenzaById.GetById(query.idRichiesta);

            var codiciRichiste = _getRichiestaAssistenzaById.GetListaCodiciSintesiRichiesta(richiesta.CodUOCompetenza);

            Log.Debug("Fine elaborazione Sintesi Richiesta by Codice Richiesta Handler");

            return new GetCodiciRichiesteAssistenzaResult()
            {
                ListaCodiciRichiesta = codiciRichiste
            };
        }
    }
}
