//-----------------------------------------------------------------------
// <copyright file="IGetMezziInServizioPerUnitaOperativa.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Organigramma;
using SO115App.API.Models.Classi.Soccorso.Mezzi;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi
{
    /// <summary>
    /// Restituisce l'elenco dei mezzi in servizio
    /// </summary>
    public interface IGetMezziInServizioPerUnitaOperativa
    {
        /// <summary>
        /// Restituisce l'elenco dei mezzi in servizio
        /// </summary>
        /// <param name="nodi">L'elenco dei pin per i quali devono essere restituiti i mezzi</param>
        /// <returns>L'elenco dei mezzi in servizio</returns>
        IEnumerable<Mezzo> Get(IEnumerable<PinNodo> nodi);
    }
}