//-----------------------------------------------------------------------
// <copyright file="DeleteRuoliUtenteNotifier.cs" company="CNVVF">
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
using CQRS.Commands.Notifiers;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.DeleteRuoliUtente
{
    /// <summary>
    ///   classe che getsisce la notifica di cancellazione di un ruolo
    /// </summary>
    public class DeleteRuoliUtenteNotifier : ICommandNotifier<DeleteRuoliUtenteCommand>
    {
        private readonly INotifyDeleteRuolo _sender;

        public DeleteRuoliUtenteNotifier(INotifyDeleteRuolo sender)
        {
            _sender = sender;
        }

        /// <summary>
        ///   il metodo che richiama il notifier
        /// </summary>
        /// <param name="command">il command con i parametri di ingresso</param>
        public void Notify(DeleteRuoliUtenteCommand command)
        {
            _sender.Notify(command);
        }
    }
}
