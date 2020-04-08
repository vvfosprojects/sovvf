//-----------------------------------------------------------------------
// <copyright file="SetMezzoPrenotatoCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Composizione;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato
{
    /// <summary>
    ///   Servizio che si occupa della gestione della prenotazione del mezzo.
    /// </summary>
    public class SetMezzoPrenotatoCommandHandler : ICommandHandler<SetMezzoPrenotatoCommand>
    {
        private readonly ISetMezzoPrenotato _setMezzoPrenotato;

        /// <summary>
        ///   Costruttore della classe
        /// </summary>
        public SetMezzoPrenotatoCommandHandler(ISetMezzoPrenotato setMezzoPrenotato)
        {
            _setMezzoPrenotato = setMezzoPrenotato;
        }

        /// <summary>
        ///   Metodo della classe che si occupa di settare il mezzo come prenotato
        /// </summary>
        /// <param name="command">l'oggetto mezzo prenotato</param>
        public void Handle(SetMezzoPrenotatoCommand command)
        {
            _setMezzoPrenotato.Set(command);
        }
    }
}
