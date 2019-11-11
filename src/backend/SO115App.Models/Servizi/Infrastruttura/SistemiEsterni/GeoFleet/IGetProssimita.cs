//-----------------------------------------------------------------------
// <copyright file="IGetProssimita.cs" company="CNVVF">
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
using SO115App.Models.Classi.ServiziEsterni;
using System.Collections.Generic;

namespace SO115App.Models.Servizi.Infrastruttura.GeoFleet
{
    /// <summary>
    ///   Servizio che recupera la posizione di tutti i mezzi in prossimità di un punto.
    /// </summary>
    public interface IGetProssimita
    {
        /// <summary>
        ///   Restituisce le posizioni di tutti i mezzi prossimi al dato set di coordinate
        /// </summary>
        /// <param name="lat">latitudine del punto</param>
        /// <param name="lon">longitudine del punto</param>
        /// <param name="maxRadius">la distanza massima dal set di coordinate</param>
        /// <param name="classiMezzo">una lista di classi mezzo</param>
        /// <param name="attSec">
        ///   valore secondo il quale viene restituita la posizione dell'intera flotta
        /// </param>
        /// <returns>Le posizioni dei mezzi da Geofleet</returns>
        List<ProssimitaMezzo> Get(float lat, float lon, float maxRadius, List<string> classiMezzo, int attSec);
    }
}
