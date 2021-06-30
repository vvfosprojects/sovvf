//-----------------------------------------------------------------------
// <copyright file="PreAccoppiati.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Composizione
{
    public class PreAccoppiato
    {
        public string CodiceMezzo { get; set; }
        public string GenereMezzo { get; set; }
        public string StatoMezzo { get; set; }
        public string DescrizioneMezzo { get; set; }
        public string Distaccamento { get; set; }
        public string Km { get; set; }
        public string TempoPercorrenza { get; set; }
        public List<Squadra> Squadre { get; set; }
    }

    /// <summary>
    /// Squadra del preaccoppiato
    /// </summary>
    public class Squadra
    {
        public Squadra(string codice, string nome, string stato) =>
            (Codice, Nome, Stato) = (codice, nome, stato);

        public Squadra() { }

        public string Codice { get; set; }
        public string Stato { get; set; }
        public string Nome { get; set; }
    }
}
