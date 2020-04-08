//-----------------------------------------------------------------------
// <copyright file="IEspandiPinNodoSuOrganigramma.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;

namespace SO115App.API.Models.Servizi.Infrastruttura.Organigramma
{
    /// <summary>
    ///   Questo servizio si occupa della espansione di una serie di <see cref="PinNodo" /> in una
    ///   lista dei codici nodo, con riferimento all'organigramma.
    /// </summary>
    /// <example>
    ///   Se la lista dei <see cref="PinNodo" /> contiene un nodo non ricorsivo e un nodo disgiunto
    ///   ricorsivo, il servizio restituisce una sequenza contenente il codice del primo nodo e tutti
    ///   i codici di tutti i nodi contenuti nel sottoalbero del secondo nodo.
    /// </example>
    public interface IEspandiPinNodoSuOrganigramma
    {
        /// <summary>
        ///   Espande una serie di <see cref="PinNodo" /> nella serie di codici sull'organigramma.
        /// </summary>
        /// <param name="pinsNodo">L'enumerable di <see cref="PinNodo" /> da espandere.</param>
        /// <returns>
        ///   La lista di codici di tutti i nodi intercettati dai <see cref="PinNodo" /> .
        /// </returns>
        IEnumerable<string> Espandi(IEnumerable<PinNodo> pinsNodo);
    }
}
