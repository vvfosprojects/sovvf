//-----------------------------------------------------------------------
// <copyright file="SetMezzoPrenotatoCommand.cs" company="CNVVF">
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
namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato
{
    /// <summary>
    ///   Il command che contine l'oggetto mezzo prenotato per la gestione della prenotazione del mezzo
    /// </summary>
    public class SetMezzoPrenotatoCommand
    {
        /// <summary>
        ///   L'oggetto MezzoPrenotato.
        /// </summary>
        public API.Models.Classi.Composizione.MezzoPrenotato MezzoPrenotato { get; set; }
    }
}
