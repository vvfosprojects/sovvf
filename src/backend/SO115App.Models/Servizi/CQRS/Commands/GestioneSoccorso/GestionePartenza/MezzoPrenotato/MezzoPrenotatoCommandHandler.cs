//-----------------------------------------------------------------------
// <copyright file="MezzoPrenotatoQueryHandler.cs" company="CNVVF">
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
using CQRS.Queries;
using DomainModel.CQRS.Commands.MezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.GetMezzoPrenotato;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.MezzoPrenotato
{
    /// <summary>
    ///   Servizio che restituisce tutti i valori dei Box presenti in HomePage.
    /// </summary>
    public class MezzoPrenotatoCommandHandler : ICommandHandler<MezzoPrenotatoCommand>
    {
        private readonly IGetMezzoPrenotato _iGetMezzoPrenotato;

        public MezzoPrenotatoCommandHandler(IGetMezzoPrenotato iGetMezzoPrenotato)
        {
            this._iGetMezzoPrenotato = iGetMezzoPrenotato;
        }

        /// <summary>
        ///   Query che estrae i valori dei Box presenti in Home Page
        /// </summary>
        /// <param name="command">Filtri utilizzati per l'estrazione</param>
        /// <returns>Elenco dei mezzi disponibili</returns>
        public void Handle(MezzoPrenotatoCommand command)
        {
            // preparazione del DTO
            command.MezzoPrenotato = _iGetMezzoPrenotato.Get(command);
        }
    }
}
