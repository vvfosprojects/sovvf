﻿// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF. SOVVF is free software: you can redistribute it and/or modify it under
// the terms of the GNU Affero General Public License as published by the Free Software Foundation,
// either version 3 of the License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
// the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
// General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License along with this program.
// If not, see <http://www.gnu.org/licenses/>.

using Modello.Classi.Soccorso.Squadre;

namespace Modello.Servizi.GestioneSoccorso
{
    /// <summary>
    ///   Servizio che recupera l'entità <see cref="DisponibilitaSquadra" /> attraverso il suo Ticket.
    /// </summary>
    public interface IGetDisponibilitaSquadraByTicket
    {
        /// <summary>
        ///   Preleva l'entità <see cref="DisponibilitaSquadra" /> attraverso il suo Ticket.
        /// </summary>
        /// <param name="ticket">Il ticket identificativo della <see cref="DisponibilitaSquadra" />.</param>
        /// <returns>La <see cref="DisponibilitaSquadra" /> prelevata.</returns>
        DisponibilitaSquadra Get(string ticket);
    }
}
