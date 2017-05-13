//-----------------------------------------------------------------------
// <copyright file="IEspandiTagsNodoSuOrganigramma.cs" company="CNVVF">
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
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Modello.Classi.Organigramma;

namespace Modello.Servizi.Infrastruttura.Organigramma
{
    /// <summary>
    ///   Questo servizio si occupa della espansione di una serie di <see cref="TagNodo" /> in una
    ///   lista dei codici nodo, con riferimento all'organigramma. In altre parole, se la lista dei
    ///   <see cref="TagNodo" /> contiene un nodo non ricorsivo e un nodo disgiunto ricorsivo, il
    ///   servizio restituisce una lista contenente i codici del primo nodo e tutti i codici di tutti
    ///   i nodi contenuti nel sottoalbero del secondo nodo.
    /// </summary>
    public interface IEspandiTagsNodoSuOrganigramma
    {
        /// <summary>
        ///   Espande una serie di <see cref="TagNodo" /> nella serie di codici sull'organigramma.
        /// </summary>
        /// <param name="tagsNodo">L'enumerable di <see cref="TagNodo" /> da espandere.</param>
        /// <returns>La lista di codici di tutti i nodi intercettati dai tags.</returns>
        IEnumerable<string> Espandi(IEnumerable<TagNodo> tagsNodo);
    }
}
