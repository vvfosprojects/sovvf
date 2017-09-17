//-----------------------------------------------------------------------
// <copyright file="GetCompetenzeByPunto_Fake_Hardcoded.cs" company="CNVVF">
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
using Modello.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali;

namespace SOVVF.FakeImplementations.Modello.Infrastruttura.CompetenzeTerritoriali
{
    /// <summary>
    ///   Classe fake che implementa il servizio che restituisce le competenze territoriali dato un
    ///   punto geolocalizzato
    /// </summary>
    internal class GetCompetenzeByPunto_Fake_Hardcoded : IGetCompetenzeByPunto
    {
        /// <summary>
        ///   Restituisce dei valori fake
        /// </summary>
        /// <param name="punto">Non utilizzato</param>
        /// <returns>I valori fake</returns>
        public string[] GetCompetenze(Punto punto)
        {
            return new[] { "CodUO1", "CodUO2", "CodUO3" };
        }
    }
}
