//-----------------------------------------------------------------------
// <copyright file="SedeDTO.cs" company="CNVVF">
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

namespace SO115App.ExternalAPI.Fake.Classi.Uos
{
    public class SedeDTO
    {
        public string status { get; set; }
        public List<ElencoSediDTO> elenco { get; set; }

        public int numTotaleOccorrenze { get; set; }

        public string message { get; set; }
    }

    public class ElencoSediDTO
    {
        public string id { get; set; }
        public string codSede { get; set; }

        public IndirizzoSede indirizzoSede { get; set; }

        public List<Recapito> recapito { get; set; }

        public List<Mail> mail { get; set; }

        public string coordinateGeo { get; set; }

        public string dtValInizio { get; set; }
        public string dtValFine { get; set; }
    }

    public class IndirizzoSede
    {
        public string indirizzo { get; set; }

        public string cap { get; set; }

        public int codRegione { get; set; }

        public string codProvincia { get; set; }

        public string codComune { get; set; }
    }

    public class Recapito
    {
        public string tipo { get; set; }
        public string numero { get; set; }
    }

    public class Mail
    {
        public string mail { get; set; }
        public string flUfficiale { get; set; }
    }
}
