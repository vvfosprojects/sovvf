﻿//-----------------------------------------------------------------------
// <copyright file="ComposizioneMezzi.cs" company="CNVVF">
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
using SO115App.Models.Classi.Composizione;
using System;
using System.Collections.Generic;

namespace SO115App.API.Models.Classi.Composizione
{
    public class ComposizioneMezzi
    {
        public string Id { get; set; }
        public Mezzo Mezzo { get; set; }

        /// <summary>
        ///   Squadre preaccoppiate
        /// </summary>
        public List<SquadraSemplice> SquadrePreaccoppiate { get; set; } = null;

        /// <summary>
        /// Squadre in rientro
        /// </summary>
        public List<SquadraSemplice> ListaSquadre { get; set; } = null;

        public string Km { get; set; }
        public string TempoPercorrenza { get; set; }
        public DateTime? IstanteScadenzaSelezione { get; set; }

        /// <summary>
        ///   Incide generato dinamicamente, cambia da richiesta a richiesta. Serve ad ordinare i
        ///   mezzi, dal più opportuno al meno opportuno nella composizione partenza
        /// </summary>
        public decimal IndiceOrdinamento { get; set; }

        /// <summary>
        ///   Se un mezzo si trova sul posto indicare anche l'indirizzo dell'intervento
        /// </summary>
        public string IndirizzoIntervento { get; set; }
    }

    public class SquadraSemplice
    {
        public string Codice { get; set; }
        public Sede Distaccamento { get; set; }
        public string Nome { get; set; }
        public StatoSquadraComposizione Stato { get; set; }
        public char Turno { get; set; }
    }
}
