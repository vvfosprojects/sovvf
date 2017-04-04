//-----------------------------------------------------------------------
// <copyright file="DeselezionaSquadraCommand.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO
{
    /// <summary>
    ///   Oggetto Command per la deselezione di una squadra che definisce i parametri necessari
    ///   all'esecuzione del comando di deselezione squadra.
    /// </summary>
    public class DeselezionaSquadraCommand
    {
        /// <summary>
        ///   Identificativo univoco della squadra.
        /// </summary>
        public string Ticket { get; set; }
    }
}
