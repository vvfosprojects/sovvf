//-----------------------------------------------------------------------
// <copyright file="AssociativaDTO.cs" company="CNVVF">
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
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.Uos
{
    internal class AssociativaDTO
    {
        public string status { get; set; }
        public List<ElencoSedi> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    internal class ElencoSedi
    {
        public string codUnitaOrganizzativa { get; set; }

        public string codSede { get; set; }

        public string codAssociativo { get; set; }

        public string descrizione { get; set; }

        public string dtValInizio { get; set; }

        public string dtValFine { get; set; }

        public string dtIns { get; set; }

        public string dtUltAgg { get; set; }

        public string user { get; set; }

        public string codTipoUnitaOrganizzativa { get; set; }
    }
}
