//-----------------------------------------------------------------------
// <copyright file="RichiestaCommandHandler.cs" company="CNVVF">
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
using SO115App.Models.Classi.Soccorso.Eventi.Emergenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneEmergenza;
using System;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.Richiesta
{
    public class RichiestaCommandHandler : ICommandHandler<RichiestaCommand>
    {
        private readonly IUpDateEmergenza _upDateEmergenza;
        private readonly IGetEmergenzaById _getEmergenzaById;

        public RichiestaCommandHandler(IUpDateEmergenza upDateEmergenza, IGetEmergenzaById getEmergenzaById)
        {
            _upDateEmergenza = upDateEmergenza;
            _getEmergenzaById = getEmergenzaById;
        }

        public void Handle(RichiestaCommand command)
        {
            var InfoEmergenza = _getEmergenzaById.Get(command.Id);
            InfoEmergenza.AddEvento(new RichiestaEmergenza(DateTime.UtcNow, command.CodOperatore, InfoEmergenza.CodEmergenza, InfoEmergenza.Tipologia.emergenza[0], command.TipologieModuli));

            command.InfoEmergenza = InfoEmergenza;
            _upDateEmergenza.Update(InfoEmergenza);
        }
    }
}
