﻿//-----------------------------------------------------------------------
// <copyright file="Coordinate.cs" company="CNVVF">
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

using System.Text.Json.Serialization;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Coordinate
    {
        public Coordinate(double Latitudine = 0.0, double Longitudine = 0.0)
        {
            this.Latitudine = Latitudine;
            this.Longitudine = Longitudine;
        }

        /// <summary>
        ///   Latitudine
        /// </summary>
        [JsonConverter(typeof(string))]
        public double Latitudine { get; set; }

        /// <summary>
        ///   Latitudine
        /// </summary>
        [JsonConverter(typeof(string))]
        public double Longitudine { get; set; }

        public CoordinateString ToCoordinateString()
        {
            return new CoordinateString(Latitudine.ToString(), Longitudine.ToString());
        }
    }

    public class CoordinateString
    {
        public CoordinateString(string Latitudine = "0", string Longitudine = "0")
        {
            this.Latitudine = Latitudine.Replace(",",".");
            this.Longitudine = Longitudine.Replace(",", ".");
        }

        /// <summary>
        ///   Latitudine
        /// </summary>
        [JsonConverter(typeof(string))]
        public string Latitudine { get; set; }

        /// <summary>
        ///   Latitudine
        /// </summary>
        [JsonConverter(typeof(string))]
        public string Longitudine { get; set; }
    }
}
