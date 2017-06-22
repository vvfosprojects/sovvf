//-----------------------------------------------------------------------
// <copyright file="IGetTipoInterventoByCodice.cs" company="CNVVF">
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
using Modello.Classi.Soccorso;

namespace Modello.Servizi.Infrastruttura.Anagrafiche
{
    /// <summary>
    ///   Servizio per la risoluzione di una tipologia di richiesta a partire dal suo codice.
    /// </summary>
    public interface IGetTipoInterventoByCodice
    {
        /// <summary>
        ///   Restituisce la tipologia di intervento
        /// </summary>
        /// <param name="codice">Il codice della tipologia richiesta</param>
        /// <returns>La tipologia</returns>
        TipologiaRichiesta Get(string codice);
    }
}
