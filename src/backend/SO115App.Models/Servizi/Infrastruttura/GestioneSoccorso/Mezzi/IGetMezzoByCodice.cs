//-----------------------------------------------------------------------
// <copyright file="IGetMezzoByCodice.cs" company="CNVVF">
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

using SO115App.API.Models.Classi.Condivise;

namespace SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi
{
    /// <summary>
    ///   Servizio di risoluzione di un <see cref="Mezzo" /> mediante interrogazione di un'anagrafica
    ///   dei mezzi.
    /// </summary>
    public interface IGetMezzoByCodice
    {
        /// <summary>
        ///   Restituisce l'anagrafica del mezzo a partire dal suo codice
        /// </summary>
        /// <param name="codice">Il codice del mezzo</param>
        /// <returns>L'anagrafica del mezzo</returns>
        Mezzo Get(string codice);
    }
}
