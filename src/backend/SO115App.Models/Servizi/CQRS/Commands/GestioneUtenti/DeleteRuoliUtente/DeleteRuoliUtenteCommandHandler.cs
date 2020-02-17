//-----------------------------------------------------------------------
// <copyright file="DeleteRuoliUtenteCommandHandler.cs" company="CNVVF">
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
using CQRS.Commands;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente
{
    /// <summary>
    ///   classe che si occupa della logica di cancellazione di un ruolo da un operatore
    /// </summary>
    public class DeleteRuoliUtenteCommandHandler : ICommandHandler<DeleteRuoliUtenteCommand>
    {
        private readonly IDeleteRuolo _deleteRuolo;

        /// <summary>
        ///   costruttore della classe
        /// </summary>
        /// <param name="deleteRuolo"></param>
        public DeleteRuoliUtenteCommandHandler(IDeleteRuolo deleteRuolo)
        {
            _deleteRuolo = deleteRuolo;
        }

        /// <summary>
        ///   l'handler che si occupa di richiamare la logica di cancellazione
        /// </summary>
        /// <param name="command">il command con i parametri di ingresso</param>
        public void Handle(DeleteRuoliUtenteCommand command)
        {
            _deleteRuolo.Delete(command.CodiceFiscali, command.Ruolo);
        }
    }
}
