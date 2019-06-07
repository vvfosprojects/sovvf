//-----------------------------------------------------------------------
// <copyright file="BoxInterventi.cs" company="CNVVF">
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
namespace SO115App.API.Models.Classi.Boxes
{
    public class BoxInterventi
    {
        public int Chiamate { get; set; }

        public int Assegnati { get; set; }

        public int Presidiati { get; set; }

        public int Sospesi { get; set; }

        public int Totale { get; set; }

        public int TotTurnoCorrente { get; set; }

        public int TotTurnoPrecedente { get; set; }

        public string NomeTurnoCorrente { get; set; }

        public string NomeTurnoPrecedente { get; set; }

        public int AnnoCorrente { get; set; }

        public int TotAnnoCorrente { get; set; }
    }
}
