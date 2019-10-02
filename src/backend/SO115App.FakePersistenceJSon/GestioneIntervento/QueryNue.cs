//-----------------------------------------------------------------------
// <copyright file="GetComposizioneMezzi.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Geo;
using System;
using System.Collections.Generic;

namespace SO115App.FakePersistence.JSon.GestioneIntervento
{
    public class QueryNue
    {
        public string CodiceSede { get; set; }
        public string CodiceOperatore { get; set; }
        public string CodiceScheda { get; set; }
        public string TestoLibero { get; set; }
        public List<string> CodiceFiscale { get; set; }
        public List<string> TipoScheda { get; set; }
        public AreaMappa AreaMappa { get; set; }
        public DateTime DataA { get; set; }
        public DateTime DataDa { get; set; }
        public bool Letta { get; set; }
        public bool Gestita { get; set; }
    }
}
