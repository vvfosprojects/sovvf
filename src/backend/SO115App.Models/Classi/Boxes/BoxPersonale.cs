//-----------------------------------------------------------------------
// <copyright file="BoxPersonale.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Boxes
{
    public class BoxPersonale
    {
        public int PersonaleTotale { get; set; }

        public List<BoxFunzionariSo> Funzionari { get; set; }

        public int SquadreServizio { get; set; }

        public int SquadreAssegnate { get; set; }
    }

    public class BoxFunzionariSo
    {
        public string CodiceFiscale { get; set; }

        public string Qualifica { get; set; }

        public string Descrizione { get; set; }

        public bool FunGuardia { get; set; }

        public bool TecnicoGuardia1 { get; set; }

        public bool TecnicoGuardia2 { get; set; }

        public bool CapoTurno { get; set; }

        public string Telefono { get; set; }
    }
}
