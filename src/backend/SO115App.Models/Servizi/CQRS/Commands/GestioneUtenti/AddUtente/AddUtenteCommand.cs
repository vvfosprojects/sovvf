//-----------------------------------------------------------------------
// <copyright file="AddUtenteCommand.cs" company="CNVVF">
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
using System.Collections.Generic;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddUtente
{
    /// <summary>
    ///   modello del command che mappa l'aggiunta del ruolo e dell'utente al database degli operatori
    /// </summary>
    public class AddUtenteCommand
    {
        /// <summary>
        ///   codice sede dell'operatore
        /// </summary>
        public string CodiceSede { get; set; }

        /// <summary>
        ///   codice fiscale dell'operatore
        /// </summary>
        public string CodFiscale { get; set; }

        /// <summary>
        ///   lista di ruoli da aggiungere
        /// </summary>
        public List<Role> Ruoli { get; set; }

        /// <summary>
        ///   booleana che se valorizata aggiunge i ruoli solo al distaccamento e non al comando centrale
        /// </summary>
        public bool SoloDistaccamenti { get; set; }
    }
}
