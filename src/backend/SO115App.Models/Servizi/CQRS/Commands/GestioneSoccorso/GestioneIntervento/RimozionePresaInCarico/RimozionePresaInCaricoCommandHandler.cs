﻿//-----------------------------------------------------------------------
// <copyright file="AddInterventoCommandHandler.cs" company="CNVVF">
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
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;

namespace DomainModel.CQRS.Commands.RimozionePresaInCarico
{
    public class RimozionePresaInCaricoCommandHandler : ICommandHandler<RimozionePresaInCaricoCommand>
    {
        private readonly IGetRichiesta _getRichiestaById;
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;
        private readonly IGetUtenteById _getUtenteById;

        public RimozionePresaInCaricoCommandHandler(
            IGetRichiesta getRichiestaById,
            IUpDateRichiestaAssistenza updateRichiestaAssistenza,
            IGetUtenteById getUtenteById
            )
        {
            _getRichiestaById = getRichiestaById;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
            _getUtenteById = getUtenteById;
        }

        public void Handle(RimozionePresaInCaricoCommand command)
        {
            var richiesta = _getRichiestaById.GetById(command.IdRichiesta);

            new AnnullamentoPresaInCarico(richiesta, DateTime.UtcNow, richiesta.CodOperatore);

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
