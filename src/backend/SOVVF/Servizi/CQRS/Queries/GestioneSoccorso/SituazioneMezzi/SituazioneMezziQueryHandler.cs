//-----------------------------------------------------------------------
// <copyright file="SituazioneMezziQueryHandler.cs" company="CNVVF">
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
using System;
using System.Collections.Generic;
using System.Linq;
using Modello.Classi.Organigramma;
using Modello.Classi.Soccorso.Eventi.Partenze;
using Modello.Classi.Soccorso.Mezzi.SituazioneMezzo;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.QueryDTO;
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi.ResultDTO;
using Modello.Servizi.Infrastruttura.GestioneSoccorso;
using Modello.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using Modello.Servizi.Infrastruttura.Organigramma;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.SituazioneMezzi
{
    /// <summary>
    ///   Restituisce lo stato dei mezzi impiegati per il soccorso.
    /// </summary>
    public class SituazioneMezziQueryHandler : IQueryHandler<SituazioneMezziQuery, SituazioneMezziResult>
    {
        /// <summary>
        ///   Istanza del servizio
        /// </summary>
        private readonly IGetSituazioneMezzi getSituazioneMezzi;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        /// <param name="getSituazioneMezzi">Istanza del servizio <see cref="IGetSituazioneMezzi" /></param>
        public SituazioneMezziQueryHandler(IGetSituazioneMezzi getSituazioneMezzi)
        {
            this.getSituazioneMezzi = getSituazioneMezzi;
        }

        /// <summary>
        ///   Esegue la query
        /// </summary>
        /// <param name="query">Il DTO</param>
        /// <returns>La situazione mezzi</returns>
        public SituazioneMezziResult Handle(SituazioneMezziQuery query)
        {
            var situazioneMezzi = this.getSituazioneMezzi.Get(query.UnitaOperative);

            return new SituazioneMezziResult()
            {
                SituazioneMezzi = situazioneMezzi
            };
        }
    }
}
