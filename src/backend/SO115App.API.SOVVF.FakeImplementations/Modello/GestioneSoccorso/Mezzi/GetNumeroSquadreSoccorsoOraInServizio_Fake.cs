//-----------------------------------------------------------------------
// <copyright file="GetNumeroSquadreSoccorsoOraInServizio_Fake.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio fake
    /// </summary>
    public class GetNumeroSquadreSoccorsoOraInServizio_Fake : IGetNumeroSquadreSoccorsoOraInServizio
    {
        /// <summary>
        ///   Restituisce il numero di squadre in servizio
        /// </summary>
        /// <param name="codice">Le unità operative implicate nel calcolo</param>
        /// <returns>Il numero di unità squadra in servizio</returns>
        public int Get(IEnumerable<string> codice)
        {
            return 10;
        }
    }
}
