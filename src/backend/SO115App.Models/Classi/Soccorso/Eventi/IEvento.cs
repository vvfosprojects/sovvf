//-----------------------------------------------------------------------
// <copyright file="IEvento.cs" company="CNVVF">
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

namespace SO115App.API.Models.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Interfaccia implementata da tutti gli eventi di una richiesta di assistenza
    /// </summary>
    public interface IEvento
    {
        /// <summary>
        ///   E' l'istante in cui si è verificato l'evento.
        /// </summary>
        string codiceFonte { get; }

        /// <summary>
        ///   E' l'identificativo univoco della fonte informativa sull'evento, che ha anche la
        ///   responsabilità di garantirne la veridicità. Può essere per esempio un operatore SO, un
        ///   sensore, un altro sistema informativo, lo stesso SOVVF.
        /// </summary>
        DateTime istante { get; }
    }
}