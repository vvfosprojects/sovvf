//-----------------------------------------------------------------------
// <copyright file="PreAccoppiatiQueryHandler.cs" company="CNVVF">
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
using DomainModel.CQRS.Commands.PreAccoppiati;
using SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati;

namespace SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Composizione.PreAccoppiati
{
    /// <summary>
    ///   Servizio che restituisce le relazioni dei preaccoppiamenti
    /// </summary>
    public class PreAccoppiatiCommandHandler : ICommandHandler<PreAccoppiatiCommand>
    {
        private readonly IGetPreAccoppiati _iGetPreAccoppiati;

        public PreAccoppiatiCommandHandler(IGetPreAccoppiati iGetPreAccoppiati)
        {
            this._iGetPreAccoppiati = iGetPreAccoppiati;
        }

        public void Handle(PreAccoppiatiCommand command)
        {
            var preAccoppiati = _iGetPreAccoppiati.Get(command);

            command.preAccoppiati = preAccoppiati;
        }
    }
}
