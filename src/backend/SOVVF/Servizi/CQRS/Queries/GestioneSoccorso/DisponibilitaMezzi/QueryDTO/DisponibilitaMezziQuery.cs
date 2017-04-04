//-----------------------------------------------------------------------
// <copyright file="DisponibilitaMezziQuery.cs" company="CNVVF">
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
namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.DisponibilitaMezzi
{
    /// <summary>
    ///   DTO che alimenta la ricerca dei mezzi disponibili. I mezzi possono essere filtrati per ...
    /// </summary>
    public class DisponibilitaMezziQuery : IQuery<DisponibilitaMezziResult>
    {
        /// <summary>
        ///   Filtra solo i mezzi appartenenti all'unità operativa indicata.
        /// </summary>
        /// <remarks>
        ///   L'unità operativa indicata sarà una di quelle su cui l'operatore ha privilegi di gestione.
        /// </remarks>
        public string FiltroCodiceUnitaOperativa { get; set; }
    }
}
