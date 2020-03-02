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
using SO115App.API.Models.Classi.Soccorso.Eventi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Soccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System;
using System.Collections.Generic;

namespace DomainModel.CQRS.Commands.PresaInCarico
{
    public class PresaInCaricoCommandHandler : ICommandHandler<PresaInCaricoCommand>
    {
        private readonly IGetRichiestaById _getRichiestaById;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IUpDateRichiestaAssistenza _updateRichiestaAssistenza;

        public PresaInCaricoCommandHandler(
            IGetRichiestaById getRichiestaById,
            IGetUtenteById getUtenteById,
            IUpDateRichiestaAssistenza updateRichiestaAssistenza
            )
        {
            _getRichiestaById = getRichiestaById;
            _getUtenteById = getUtenteById;
            _updateRichiestaAssistenza = updateRichiestaAssistenza;
        }

        public void Handle(PresaInCaricoCommand command)
        {
            var richiesta = _getRichiestaById.GetById(command.IdRichiesta);
            var utente = _getUtenteById.GetUtenteByCodice(command.IdUtente);

            var nominativoPresaInCarico = utente.Nome + "." + utente.Cognome;

            if (richiesta.UtPresaInCarico != null)
            {
                new InizioPresaInCarico(richiesta, DateTime.UtcNow, richiesta.CodOperatore);

                richiesta.UtPresaInCarico.Add(nominativoPresaInCarico);
            }
            else
            {
                richiesta.UtPresaInCarico = new List<string>
                {
                    nominativoPresaInCarico
                };
            }

            _updateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
