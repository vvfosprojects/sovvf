// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

namespace Modello.Classi.Geo
{
    /// <summary>
    ///   Modella un cerchio sul globo
    /// </summary>
    public class Cerchio : Geolocalizzazione
    {
        /// <summary>
        ///   E' il centro del cerchio
        /// </summary>
        public Punto Centro { get; set; }

        /// <summary>
        ///   E' il raggio del cerchio
        /// </summary>
        public double Raggio { get; set; }
    }
}
