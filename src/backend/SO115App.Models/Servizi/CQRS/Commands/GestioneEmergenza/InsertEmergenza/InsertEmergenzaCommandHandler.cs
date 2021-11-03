//-----------------------------------------------------------------------
// <copyright file="InsertEmergenzaCommandHandler.cs" company="CNVVF">
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

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.InsertEmergenza
{
    public class InsertEmergenzaCommandHandler : ICommandHandler<InsertEmergenzaCommand>
    {
        private readonly IInsertEmergenza _insertEmergenza;
        private readonly IGetCodiceEmergenza _getCodiceEmergenza;

        public InsertEmergenzaCommandHandler(IInsertEmergenza insertEmergenza, IGetCodiceEmergenza getCodiceEmergenza)
        {
            _insertEmergenza = insertEmergenza;
            _getCodiceEmergenza = getCodiceEmergenza;
        }

        public void Handle(InsertEmergenzaCommand command)
        {
            command.InfoEmergenza.CodEmergenza = _getCodiceEmergenza.Get(command.InfoEmergenza.CodComandoRichiedente, command.InfoEmergenza.Tipologia.ToString());
            command.InfoEmergenza.AddEvento(new CreazioneEmergenza(DateTime.UtcNow, command.InfoEmergenza.CodEmergenza, command.CodOperatore, command.InfoEmergenza.Tipologia));
            _insertEmergenza.Insert(command.InfoEmergenza);
        }
    }
}
