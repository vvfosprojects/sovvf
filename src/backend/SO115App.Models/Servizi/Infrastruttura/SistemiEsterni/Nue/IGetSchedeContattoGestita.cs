﻿//-----------------------------------------------------------------------
// <copyright file="IGetSchedeContattoGestita.cs" company="CNVVF">
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
using SO115App.Models.Classi.NUE;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue
{
    /// <summary>
    ///   Interfaccia del servizio che restituisce l'elenco delle schede contatto corrispondenti ai
    ///   criteri di ricerca indicati
    /// </summary>
    public interface IGetSchedeContattoGestita
    {
        /// <summary>
        ///   Restituisce l'elenco delle schede contatto corrispondenti ai criteri di ricerca indicati
        /// </summary>
        /// <returns>Lista schede contatto</returns>
        List<SchedaContatto> SchedeContattoGestita(bool gestita, string codiceSede);
    }
}
