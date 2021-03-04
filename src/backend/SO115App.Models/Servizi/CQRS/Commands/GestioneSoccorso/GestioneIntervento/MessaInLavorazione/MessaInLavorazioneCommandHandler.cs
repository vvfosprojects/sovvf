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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using System.Collections.Generic;

namespace DomainModel.CQRS.Commands.MessaInLavorazione
{
    public class MessaInLavorazioneCommandHandler : ICommandHandler<MessaInLavorazioneCommand>
    {
        private readonly IGetRichiesta _getRichiestaById;

        private readonly IGetUtenteById _getUtenteById;
        private readonly IUpDateRichiestaAssistenza _upDateRichiestaAssistenza;

        public MessaInLavorazioneCommandHandler(
            IGetRichiesta GetRichiestaById,
            IGetUtenteById GetUtenteById,
            IUpDateRichiestaAssistenza UpDateRichiestaAssistenza
            )
        {
            _getRichiestaById = GetRichiestaById;
            _getUtenteById = GetUtenteById;
            _upDateRichiestaAssistenza = UpDateRichiestaAssistenza;
        }

        public void Handle(MessaInLavorazioneCommand command)
        {
            var richiesta = _getRichiestaById.GetByCodice(command.IdRichiesta);
            var utente = _getUtenteById.GetUtenteByCodice(command.IdUtente);
            var nominativoInLavorazione = utente.Nome + "." + utente.Cognome;

            if (richiesta.UtInLavorazione != null)
            {
                if (!richiesta.UtInLavorazione.Contains(nominativoInLavorazione))
                    richiesta.UtInLavorazione.Add(nominativoInLavorazione);
            }
            else
            {
                richiesta.UtInLavorazione = new List<string>();
                richiesta.UtInLavorazione.Add(nominativoInLavorazione);
            }


            this._upDateRichiestaAssistenza.UpDate(richiesta);
        }
    }
}
