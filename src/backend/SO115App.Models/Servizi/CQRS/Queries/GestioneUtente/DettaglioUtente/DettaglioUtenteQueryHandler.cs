//-----------------------------------------------------------------------
// <copyright file="ListaOperatoriQueryHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Collections.Generic;
using System.Linq;

namespace SO115App.Models.Servizi.CQRS.Queries.GestioneUtente.DettaglioUtente
{
    /// <summary>
    ///   Il query handler che cerca la lista degli operatori
    /// </summary>
    public class DettaglioUtenteQueryHandler : IQueryHandler<DettaglioUtenteQuery, DettaglioUtenteResult>
    {
        private readonly IGetUtenteById _getUtenteById;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="getUtenteById">
        ///   interfaccia per il reperimento degli utenti a partire dall'id
        /// </param>
        /// <param name="getAlberaturaUnitaOperative">
        ///   interfaccia per il reperimento delle uo alberate
        /// </param>
        /// <param name="getUtenteByCodiciSedi">
        ///   interfaccia per la lista degli utenti a partire da una lista di codici sede
        /// </param>
        public DettaglioUtenteQueryHandler(IGetUtenteById getUtenteById)
        {
            _getUtenteById = getUtenteById;
        }

        /// <summary>
        ///   metodo che utilizza la query in firma per effettuare la ricerca degli operatori a
        ///   seconda dei parametri immessi nella query stessa
        /// </summary>
        /// <param name="query">la query in firma</param>
        /// <returns>ListaOperatoriResult</returns>
        public DettaglioUtenteResult Handle(DettaglioUtenteQuery query)
        {
            return new DettaglioUtenteResult
            {
                DetUtente = _getUtenteById.GetUtenteByCodice(query.IdUtente)
            };
        }
    }
}
