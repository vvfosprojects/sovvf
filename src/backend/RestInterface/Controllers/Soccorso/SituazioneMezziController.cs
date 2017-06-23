//-----------------------------------------------------------------------
// <copyright file="SituazioneMezziController.cs" company="CNVVF">
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
using System.Collections.Generic;
using System.Web.Http;
using Modello.Classi.Organigramma;
using Modello.Servizi.CQRS.Queries;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO;

namespace RestInterface.Controllers.Soccorso
{
    /// <summary>
    ///   Controller che restituisce la situazione dei mezzi
    /// </summary>
    public class SituazioneMezziController : ApiController
    {
        /// <summary>
        ///   L'istanza dell'handler della query
        /// </summary>
        private readonly IQueryHandler<SituazioneMezziQuery, SituazioneMezziResult> handler;

        /// <summary>
        ///   Il costruttore
        /// </summary>
        /// <param name="handler">L'handler della query</param>
        public SituazioneMezziController(IQueryHandler<SituazioneMezziQuery, SituazioneMezziResult> handler)
        {
            this.handler = handler;
        }

        /// <summary>
        ///   Restituisce la situazione dei mezzi di interesse per l'utente autenticato
        /// </summary>
        /// <param name="query">La query</param>
        /// <returns>Lo stato dei mezzi</returns>
        public SituazioneMezziResult Get(SituazioneMezziQuery query)
        {
            if (query == null)
            {
                query = new SituazioneMezziQuery()
                {
                    UnitaOperative = new HashSet<InfoUnitaOperativa>()
                };
            }

            return this.handler.Handle(query);
        }
    }
}
