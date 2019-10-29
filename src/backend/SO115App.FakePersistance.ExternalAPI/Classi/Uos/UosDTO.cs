//-----------------------------------------------------------------------
// <copyright file="UosDTO.cs" company="CNVVF">
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
    public class UosDTO
    {
        public string status { get; set; }
        public List<Elenco> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    public class Elenco
    {
        public string id { get; set; }
        public string codUnitaOrganizzativa { get; set; }

        public string descUnitaOrganizzativaBreve { get; set; }

        public string descUnitaOrganizzativa { get; set; }

        public string codTipologia { get; set; }

        public string codiceFiscale { get; set; }

        public string dtValInizio { get; set; }

        public string dtValFine { get; set; }

        public List<IndirizzoEmail> indirizzoMail { get; set; }

        public string rifUnitaOrganizzativaPadre { get; set; }

        public string dtIns { get; set; }
    }

    public class IndirizzoEmail
    {
        public string mail { get; set; }
        public string flPec { get; set; }
    }
}
