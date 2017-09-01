//-----------------------------------------------------------------------
// <copyright file="ICanAcceptVisitorStatoMezzo.cs" company="CNVVF">
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
using Modello.Classi.Soccorso.Eventi.Partenze;

namespace Modello.Classi.Soccorso.Mezzi.StatiMezzo
{
    /// <summary>
    ///   Interfaccia che dichiara i metodi che possono essere invocati da un <see cref="IVisitorStatoMezzo" />.
    /// </summary>
    public interface ICanAcceptVisitorStatoMezzo
    {
        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="arrivoSulPosto">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(ArrivoSulPosto arrivoSulPosto);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="vaInFuoriServizio">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(VaInFuoriServizio vaInFuoriServizio);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="uscitaPartenza">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(UscitaPartenza uscitaPartenza);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="revoca">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(Revoca revoca);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="partenzaRientrata">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(PartenzaInRientro partenzaRientrata);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="partenzaRientrata">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(PartenzaRientrata partenzaRientrata);

        /// <summary>
        ///   Accetta il visitor
        /// </summary>
        /// <param name="composizionePartenze">Il visitor accettato</param>
        /// <returns>Il nuovo stato</returns>
        IStatoMezzo AcceptVisitor(ComposizionePartenze composizionePartenze);
    }
}
