//-----------------------------------------------------------------------
// <copyright file="GetMezziPrenotatiQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneMezzoPrenotato
{
    /// <summary>
    ///   Servizio che si occupa del reperimento dei mezzi prenotati
    /// </summary>
    public class GetMezziPrenotatiQueryHandler : IQueryHandler<GetMezziPrenotatiQuery, GetMezzoPrenotatoResult>
    {
        private readonly IGetStatoMezzi _getMezzoPrenotato;

        /// <summary>
        ///   Costruttore della classe.
        /// </summary>
        public GetMezziPrenotatiQueryHandler(IGetStatoMezzi getMezzoPrenotato)
        {
            _getMezzoPrenotato = getMezzoPrenotato;
        }

        /// <summary>
        ///   metodo della classe che si occupa del handling della query.
        /// </summary>
        /// <param name="query">la query in ingresso</param>
        /// <returns>il risultato della query</returns>
        public GetMezzoPrenotatoResult Handle(GetMezziPrenotatiQuery query)
        {
            Log.Debug("Inizio elaborazione Lista mezzi prenotati Handler");

            var mezziPrenotati = _getMezzoPrenotato.Get(query.CodiceSede);

            Log.Debug("Fine elaborazione Lista mezzi prenotati Handler");

            return new GetMezzoPrenotatoResult
            {
                MezziPrenotati = mezziPrenotati
            };
        }
    }
}
