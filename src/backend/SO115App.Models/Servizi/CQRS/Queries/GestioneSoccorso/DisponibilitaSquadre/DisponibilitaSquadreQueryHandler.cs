//-----------------------------------------------------------------------
// <copyright file="DisponibilitaSquadreQueryHandler.cs" company="CNVVF">
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

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaSquadre
{
    /// <summary>
    ///   Servizio che restituisce l'elenco delle squadre disponibili, prenotabili dall'operatore in
    ///   base alle autorizzazioni dell'operatore.
    /// </summary>
    public class DisponibilitaSquadreQueryHandler : IQueryHandler<DisponibilitaSquadreQuery, DisponibilitaSquadreResult>
    {
        /// <summary>
        ///   Query che estrae l'elenco delle squadre disponibili
        /// </summary>
        /// <param name="query">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco delle squadre disponibili</returns>
        public DisponibilitaSquadreResult Handle(DisponibilitaSquadreQuery query)
        {
            // recupero della username dell'operatore che ha inviato la richiesta

            // recupero dell'elenco delle unità operative gestibili

            // esecuzione della query

            // preparazione del DTO
            var dsr = new DisponibilitaSquadreResult();

            // in dsr.Squadre andrà il risultato della query, utilizzando un mapping attraverso LINQ

            // return DTO
            return dsr;
        }
    }
}
