//-----------------------------------------------------------------------
// <copyright file="TestAndSetSelezioneDisponibilitaMezzo_Fake.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Risorse;

namespace SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse
{
    /// <summary>
    ///   Classe fake per la selezione della disponibilita di un mezzo
    /// </summary>
    internal class TestAndSetSelezioneDisponibilitaMezzo_Fake : ITestAndSetSelezioneDisponibilitaMezzo
    {
        /// <summary>
        ///   Metodo vuoto
        /// </summary>
        /// <param name="operatore">Il operatore</param>
        /// <param name="ticket">Il ticket</param>
        /// <returns>Il risultato fake della selezione</returns>
        public SelezioneRisorsa Esegui(string operatore, string ticket)
        {
            return new SelezioneRisorsa(operatore);
        }
    }
}
