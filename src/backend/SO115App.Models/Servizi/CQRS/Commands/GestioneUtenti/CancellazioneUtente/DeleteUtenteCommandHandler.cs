//-----------------------------------------------------------------------
// <copyright file="DeleteUtenteCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.CancellazioneUtente
{
    /// <summary>
    ///   classe che gestisce la logica per la rimozione di un utente dalla base dati
    /// </summary>
    public class DeleteUtenteCommandHandler : ICommandHandler<DeleteUtenteCommand>
    {
        private readonly IDeleteUtente _deleteUtente;

        public DeleteUtenteCommandHandler(IDeleteUtente deleteUtente)
        {
            _deleteUtente = deleteUtente;
        }

        /// <summary>
        ///   metodo che si occupa della gestione dell'eliminazione
        /// </summary>
        /// <param name="command">i parametri di ingresso</param>
        public void Handle(DeleteUtenteCommand command)
        {
            _deleteUtente.Delete(command.CodFiscale);
        }
    }
}
