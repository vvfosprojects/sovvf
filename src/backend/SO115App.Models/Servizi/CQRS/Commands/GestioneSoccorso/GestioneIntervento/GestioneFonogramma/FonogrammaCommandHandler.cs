//-----------------------------------------------------------------------
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
using DomainModel.CQRS.Commands.GestioneFonogramma;
using SO115App.API.Models.Classi.Soccorso.Eventi.Fonogramma;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Fonogramma;
using System;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class FonogrammaCommandHandler : ICommandHandler<FonogrammaCommand>
    {
        private readonly IUpDateRichiestaAssistenza _saveRichiestaAssistenza;

        public FonogrammaCommandHandler(IUpDateRichiestaAssistenza saveRichiestaAssistenza)
        {
            _saveRichiestaAssistenza = saveRichiestaAssistenza;
        }

        public void Handle(FonogrammaCommand command)
        {
            if (command.Fonogramma.Stato.Equals(StatoFonogramma.DaInviare))
            {
                new InviareFonogramma(command.Richiesta, DateTime.Now, command.Fonogramma.IdOperatore, command.Fonogramma.Destinatari, command.Fonogramma.NumeroFonogramma, command.Fonogramma.ProtocolloFonogramma);
                this._saveRichiestaAssistenza.UpDate(command.Richiesta);
            }
            else if (command.Fonogramma.Stato.Equals(StatoFonogramma.Inviato))
            {
                new FonogrammaInviato(command.Richiesta, DateTime.Now, command.Fonogramma.IdOperatore, command.Fonogramma.Destinatari, command.Fonogramma.NumeroFonogramma, command.Fonogramma.ProtocolloFonogramma);
                this._saveRichiestaAssistenza.UpDate(command.Richiesta);
            }
        }
    }
}
