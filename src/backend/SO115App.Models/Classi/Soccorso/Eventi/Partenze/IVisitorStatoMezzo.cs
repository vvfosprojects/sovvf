//-----------------------------------------------------------------------
// <copyright file="IVisitorStatoMezzo.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Mezzi.StatiMezzo;

namespace SO115App.API.Models.Classi.Soccorso.Eventi.Partenze
{
    /// <summary>
    ///   Interfaccia che definisce il metodo di visita in accordo con il pattern Visitor
    ///   <see cref="https://en.wikipedia.org/wiki/Visitor_pattern" />. Il visitor è rappresentato
    ///   dagli eventi <see cref="IPartenza" /> che visitano gli stati mezzo per produrre la
    ///   transizione verso lo stato successivo. Le transizioni vietate producono il verificarsi di
    ///   un'eccezione. Quelle consentite restituiscono il nuovo stato come risultato
    ///   dell'invocazione del metodo di visita.
    /// </summary>
    public interface IVisitorStatoMezzo
    {
        /// <summary>
        ///   Metodo di visita
        /// </summary>
        /// <param name="stato">Lo stato da visitare</param>
        /// <returns>Il nuovo stato a seguito della transizione di stato</returns>
        IStatoMezzo Visit(ICanAcceptVisitorStatoMezzo stato);
    }
}