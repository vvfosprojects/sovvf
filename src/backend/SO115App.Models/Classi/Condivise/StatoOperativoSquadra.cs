//-----------------------------------------------------------------------
// <copyright file="StatoOperativoSquadra.cs" company="CNVVF">
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
using MongoDB.Bson.Serialization.Attributes;

namespace SO115App.Models.Classi.Condivise
{
    /// <summary>
    ///   DTO dello stato operativo di una squadra
    /// </summary>
    [BsonIgnoreExtraElements]
    public class StatoOperativoSquadra
    {
        /// <summary>
        ///   l'id della richiesta a cui è associata la squadra
        /// </summary>
        public string IdRichiesta { get; set; }

        /// <summary>
        ///   l'id della squadra in uno stato operativo
        /// </summary>
        public string IdSquadra { get; set; }

        /// <summary>
        ///   lo stato operativo della squadra
        /// </summary>
        public string StatoSquadra { get; set; }

        /// <summary>
        ///   il codice sede della squadra
        /// </summary>
        public string CodiceSede { get; set; }
    }
}
