﻿//-----------------------------------------------------------------------
// <copyright file="Localita.cs" company="CNVVF">
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
using System.ComponentModel.DataAnnotations;

namespace SO115App.API.Models.Classi.Condivise
{
    public class Localita
    {
        public Localita(Coordinate _coordinate, string Indirizzo, string Note)
        {
            this.Coordinate = _coordinate;
            this.Indirizzo = Indirizzo;
            this.Note = Note;
        }

        [Required]
        public Coordinate Coordinate { get; set; }

        public string Indirizzo { get; set; }

        public string Citta { get; set; }

        public string Provincia { get; set; }
        public string Interno { get; set; }
        public string Palazzo { get; set; }
        public string Scala { get; set; }

        public string Note { get; set; }

        public string Piano { get; set; }
    }
}
