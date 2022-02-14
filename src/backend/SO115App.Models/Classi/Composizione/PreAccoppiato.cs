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
using SO115App.API.Models.Classi.Condivise;
using SO115App.Models.Classi.Composizione;
using SO115App.Models.Classi.ServiziEsterni.OPService;
using System.Collections.Generic;
using static SO115App.API.Models.Classi.Condivise.Squadra;

namespace SO115App.API.Models.Classi.Composizione
{
    public class PreAccoppiato
    {
        public string Id => CodiceMezzo;
        public string CodiceMezzo { get; set; }

        public string Appartenenza { get; set; }

        public string GenereMezzo { get; set; }
        public string StatoMezzo { get; set; }
        public string DescrizioneMezzo { get; set; }
        public string Distaccamento { get; set; }
        public string Km { get; set; }
        public string TempoPercorrenza { get; set; }
        public List<Squadra> Squadre { get; set; }
        public Coordinate Coordinate { get; set; }
    }

    /// <summary>
    ///   Squadra del preaccoppiato
    /// </summary>
    public class Squadra
    {
        public Squadra(string codice, string nome, StatoSquadra stato, List<Componente> membri) =>
            (Codice, Nome, Stato, Membri) = (codice, nome, stato, membri);

        public Squadra()
        { }

        public string Codice { get; set; }
        public StatoSquadra Stato { get; set; }
        public string Nome { get; set; }

        public List<Componente> Membri { get; set; }
    }
}
