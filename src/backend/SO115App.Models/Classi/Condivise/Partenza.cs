﻿//-----------------------------------------------------------------------
// <copyright file="Partenza.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Condivise
{
    public class Partenza
    {
        /// <summary>
        ///   Codice incrementale univoco legato alla partenza
        /// </summary>
        public int Codice { get; set; }

        /// <summary>
        ///   Lista delle squadre coinvolte
        /// </summary>
        public List<Squadra> Squadre { get; set; }

        /// <summary>
        ///   Mezzo usato nella partenza
        /// </summary>
        public Mezzo Mezzo { get; set; }

        /// <summary>
        ///   Mezzo usato nella partenza
        /// </summary>
        public bool Sganciata { get; set; }

        /// <summary>
        ///   Indica se la partenza è stata annullata
        /// </summary>
        public bool PartenzaAnnullata
        {
            get; set;
        } = false;

        /// <summary>
        ///   Indica se la partenza è terminata
        /// </summary>
        public bool Terminata { get; set; } = false;
    }
}
