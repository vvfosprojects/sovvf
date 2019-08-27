//-----------------------------------------------------------------------
// <copyright file="GeoLocalizzazione.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Condivise;

namespace SO115App.API.Models.Classi.Geo
{
    /// <summary>
    ///   Identifica il centro mappa
    /// </summary>
    public class CentroMappa
    {
        /// <summary>
        ///   Restituisce le coordinate del centro mappa
        /// </summary>
        public Coordinate CoordinateCentro { get; set; }

        /// <summary>
        ///   Restituisce le coordinate del punto utilizzato per calcolare il raggio dell'area selezionata
        /// </summary>
        public Coordinate CoordinateRaggio { get; set; }

        /// <summary>
        ///   Restituisce il livello di Zoom utilizzato sulla mappa
        /// </summary>
        public int Zoom { get; set; }
    }
}
