//-----------------------------------------------------------------------
// <copyright file="DeleteRuoliUtenteCommand.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Autenticazione;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente
{
    /// <summary>
    ///   Il modello con i parametri necessari alla cancellazione di un ruolo da un utente
    /// </summary>
    public class DeleteRuoliUtenteCommand
    {
        /// <summary>
        ///   Il codice fiscale dell operatore
        /// </summary>
        public string CodiceFiscali { get; set; }

        /// <summary>
        ///   il ruolo da cancellare
        /// </summary>
        public Role Ruolo { get; set; }
    }
}
