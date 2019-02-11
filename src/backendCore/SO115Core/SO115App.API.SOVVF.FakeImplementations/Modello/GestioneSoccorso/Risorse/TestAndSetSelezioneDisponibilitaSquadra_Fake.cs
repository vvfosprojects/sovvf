//-----------------------------------------------------------------------
// <copyright file="TestAndSetSelezioneDisponibilitaSquadra_Fake.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Risorse;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO;

namespace SO115App.API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse
{
    /// <summary>
    ///   Implementazione fake del servizio di selezione di una squadra
    /// </summary>
    internal class TestAndSetSelezioneDisponibilitaSquadra_Fake : ITestAndSetSelezioneDisponibilitaSquadra
    {
        /// <summary>
        ///   Metodo vuoto
        /// </summary>
        /// <param name="operatore">Il operatore</param>
        /// <param name="ticket">Il ticket</param>
        /// <returns>Il risultato della selezione</returns>
        public SelezioneRisorsa Esegui(string operatore, string ticket)
        {
            return new SelezioneRisorsa(operatore);
        }
    }
}
