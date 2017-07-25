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
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiestaAssistenza.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiestaAssistenza.ResultDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiestaAssistenza
{
    /// <summary>
    ///   Restituisce una Richiesta di assistenza per un IdRichiesta
    /// </summary>
    public class SintesiRichiestaAssistenzaQueryHandler : IQueryHandler<SintesiRichiestaAssistenzaQuery, SintesiRichiestaAssistenzaResult>
    {
        /// <summary>
        ///   Handler del servizio
        /// </summary>
        private readonly IGetRichiestaAssistenzaById getRichiestaAssistenzaById;

        /// <summary>
        ///   Costruttore del servizio
        /// </summary>
        /// <param name="getRichiestaAssistenzaById">Istanza del servizio <see cref="IGetRichiestaAssistenzaById" /></param>
        public SintesiRichiestaAssistenzaQueryHandler(
                IGetRichiestaAssistenzaById getRichiestaAssistenzaById)
        {
            this.getRichiestaAssistenzaById = getRichiestaAssistenzaById;
        }

        /// <summary>
        ///   Metodi di esecuzione della query
        /// </summary>
        /// <param name="query">Il DTO di ingresso della query</param>
        /// <returns>Il DTO di uscita della query</returns>
        public SintesiRichiestaAssistenzaResult Handle(SintesiRichiestaAssistenzaQuery query)
        {
            // estrae la richieste di assistenza indicata
            var richiesteAssistenza = this.getRichiestaAssistenzaById.Get(query.IdRichiesta);
            var result = new SintesiRichiestaAssistenzaResult()
            {
                SintesiRichiesta = new SintesiRichiesta()
                {
                    Codice = richiesteAssistenza.Codice
                }
            };

            return result;
        }
    }
}
