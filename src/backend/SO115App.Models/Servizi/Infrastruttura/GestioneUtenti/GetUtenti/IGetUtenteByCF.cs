//-----------------------------------------------------------------------
// <copyright file="IGetUtenteByCF.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti
{
    /// <summary>
    ///   interfaccia che estendera le classi per la ricerca dell'utente a partire dal codice Fiscale
    /// </summary>
    public interface IGetUtenteByCF
    {
        /// <summary>
        ///   il metodo get
        /// </summary>
        /// <param name="codiceFiscale">il codice fiscale dell'utente</param>
        /// <returns>l'utente cercato</returns>
        Utente Get(string codiceFiscale);
    }
}
