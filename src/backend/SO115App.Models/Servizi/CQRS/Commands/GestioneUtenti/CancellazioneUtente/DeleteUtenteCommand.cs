﻿//-----------------------------------------------------------------------
// <copyright file="DeleteUtenteCommand.cs" company="CNVVF">
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

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente
{
    /// <summary>
    ///   La classe che contiene i dati per la cancellazione di un utente dalla base dati di mongo
    /// </summary>
    public class DeleteUtenteCommand
    {
        /// <summary>
        ///   il codice fiscale dell'utente
        /// </summary>
        public string CodFiscale { get; set; }

        /// <summary>
        ///   il codice sede dell'utente che ha effetuato l'eliminazione
        /// </summary>
        public string CodiceSede { get; set; }

        /// <summary>
        ///   l'utente rimosso. Serve per la notifica.
        /// </summary>
        public Utente UtenteRimosso { get; set; }

        public Utente UtenteOperatore { get; set; }

        /// <summary>
        ///   True se l'operatore è admin della sede dell'utente che si vuole cancellare
        /// </summary>
        public bool CheckSedeAdmin { get; set; } = true;
    }
}
