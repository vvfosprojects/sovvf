﻿//-----------------------------------------------------------------------
// <copyright file="AddInterventoNotifier.cs" company="CNVVF">
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
using CQRS.Commands.Notifiers;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using System.Threading.Tasks;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo
{
    public class AggiornaStatoMezzoNotifier : ICommandNotifier<AggiornaStatoMezzoCommand>
    {
        private readonly INotifyAggiornaStatoMezzo _sender;
        private readonly INotifyUpDateRichiesta _notifyUpDateRichiesta;
        private readonly IMappingESRIMessage _mappingESRIMessage;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        public AggiornaStatoMezzoNotifier(INotifyAggiornaStatoMezzo sender,
                                          INotifyUpDateRichiesta notifyUpDateRichiesta,
                                          IMappingESRIMessage mappingESRIMessage,
                                          IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _sender = sender;
            _notifyUpDateRichiesta = notifyUpDateRichiesta;
            _mappingESRIMessage = mappingESRIMessage;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        public void Notify(AggiornaStatoMezzoCommand command)
        {
            _sender.SendNotification(command);

            Task.Run(() =>
            {
                var sintesi = _getSintesiRichiestaByCodice.GetSintesi(command.Richiesta.Codice);
                var infoESRI = _mappingESRIMessage.Map(sintesi);

                _notifyUpDateRichiesta.UpDate(infoESRI);
            });
        }
    }
}
