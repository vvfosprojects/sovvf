//-----------------------------------------------------------------------
// <copyright file="Poligonale.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Geo
{
    /// <summary>
    ///   Modella una poligonale sul globo
    /// </summary>
    public class Poligonale : Geolocalizzazione
    {
        /// <summary>
        ///   Restituisce il baricentro della poligonale
        /// </summary>
        public override Punto Baricentro
        {
            get
            {
#warning Metodo da scrivere
                throw new NotImplementedException();
            }
        }

        /// <summary>
        ///   Rappresenta la lista dei vertigi della poligonale
        /// </summary>
        /// <remarks>
        ///   Non è richiesto che il primo e l'ultimo vertice corrispondano, chiudendo così la poligonale.
        /// </remarks>
        public IList<Punto> Vertici { get; set; }
    }
}