//-----------------------------------------------------------------------
// <copyright file="UnitaOperativa.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
// </copyright>
//-----------------------------------------------------------------------
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
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Modello.Classi.Organigramma
{
    /// <summary>
    ///   E' la generica unità operativa all'interno dell'organigramma operativo del Corpo Nazionale.
    /// </summary>
    public class UnitaOperativa
    {
        /// <summary>
        ///   Codice dell'unità operativa
        /// </summary>
        public string Codice { get; set; }
    }
}
