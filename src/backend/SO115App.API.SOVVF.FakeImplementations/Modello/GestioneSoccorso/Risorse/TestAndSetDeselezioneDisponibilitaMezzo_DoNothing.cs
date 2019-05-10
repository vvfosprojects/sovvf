//-----------------------------------------------------------------------
// <copyright file="TestAndSetDeselezioneDisponibilitaMezzo_DoNothing.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse
{
    /// <summary>
    ///   Servizio fake di deselezione sulla <see cref="DisponibilitaMezzo" />.
    /// </summary>
    public class TestAndSetDeselezioneDisponibilitaMezzo_DoNothing : ITestAndSetDeselezioneDisponibilitaMezzo
    {
        /// <summary>
        ///   Metodo vuoto
        /// </summary>
        /// <param name="operatore">L'operatore (non usato)</param>
        /// <param name="codiceMezzo">Il codice mezzo (non usato)</param>
        public void Esegui(string operatore, string codiceMezzo)
        {
        }
    }
}