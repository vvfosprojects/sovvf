//-----------------------------------------------------------------------
// <copyright file="IndicatoriStatoSoccorsoQuery.cs" company="CNVVF">
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
using Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.ResultDTO;

namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.IndicatoriStatoSoccorso.QueryDTO
{
    /// <summary>
    ///   Contiene le informazioni che alimentano il calcolo degli indicatori di stato del soccorso
    /// </summary>
    public class IndicatoriStatoSoccorsoQuery : IQuery<IndicatoriStatoSoccorsoResult>
    {
        /// <summary>
        ///   E' l'insieme dei nodi dell'organigramma coinvolti nel calcolo degli indicatori
        /// </summary>
        /// <remarks>
        ///   Se UnitaOperative è un set vuoto allora il calcolo degli indicatori verrà effettuato in
        ///   base ai privilegi assegnati all'utente autenticato
        /// </remarks>
        public ISet<InfoUnitaOperativa> UnitaOperative { get; set; }
    }
}
