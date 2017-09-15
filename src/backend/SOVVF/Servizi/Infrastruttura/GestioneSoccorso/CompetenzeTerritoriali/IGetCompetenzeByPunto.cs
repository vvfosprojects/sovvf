//-----------------------------------------------------------------------
// <copyright file="IGetCompetenzeByPunto.cs" company="CNVVF">
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
using Modello.Classi.Geo;

namespace Modello.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali
{
    /// <summary>
    ///   Servizio per il mappaggio di un punto su una serie di unità operative di competenza, in
    ///   ordine di preferenza.
    /// </summary>
    public interface IGetCompetenzeByPunto
    {
        /// <summary>
        ///   Restituisce le competenze territoriali dato un punto geolocalizzato
        /// </summary>
        /// <param name="punto">La geolocalizzazione del punto</param>
        /// <returns>I codici delle unità operative di competenza, nell'ordine di preferenza</returns>
        string[] GetCompetenze(Punto punto);
    }
}
