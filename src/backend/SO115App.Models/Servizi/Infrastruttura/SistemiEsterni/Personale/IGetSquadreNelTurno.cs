//-----------------------------------------------------------------------
// <copyright file="IGetSquadreNelTurno.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Utenti;
using System.Collections.Generic;

/// <summary>
///   Interfaccia del servizio che restituisce le squadre nel turno indicato
/// </summary>
namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale
{
    public interface IGetSquadreNelTurno
    {
        /// <summary>
        ///   Restituisce le squadre nel turno indicato
        /// </summary>
        /// <param name="CodiceTurno"></param>
        /// <param name="codiceSede"></param>
        /// <returns>La lista delle squadre</returns>
        List<Turno> SquadreNelTurno(string codiceSede, string codiceTurno);
    }
}
