//-----------------------------------------------------------------------
// <copyright file="CercaRichiesteAssistenza_Empty.cs" company="CNVVF">
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
using System.Linq;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.API.Models.Classi.Soccorso
{
    public class CercaRichiesteAssistenza_Empty : ICercaRichiesteAssistenza
    {
        /// <summary>
        ///   Restituisce un set vuoto di sintesi richiesta
        /// </summary>
        /// <param name="filtro">Not used</param>
        /// <returns>Il set vuoto di richieste</returns>
        public IEnumerable<RichiestaAssistenza> Get(FiltroRicercaRichiesteAssistenza filtro)
        {
            return Enumerable.Empty<RichiestaAssistenza>();
        }
    }
}
