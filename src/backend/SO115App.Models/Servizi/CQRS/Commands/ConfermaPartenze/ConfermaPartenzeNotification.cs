//-----------------------------------------------------------------------
// <copyright file="ConfermaPartenzeNotification.cs" company="CNVVF">
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
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Matrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza.MezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso;
using System;

namespace DomainModel.CQRS.Commands.ConfermaPartenze
{
    public class ConfermaPartenzeNotification : ICommandNotifier<ConfermaPartenzeCommand>
    {
        private readonly INotificationConfermaPartenze _sender;
        private readonly ICallMatrix _callMatrix;

        public ConfermaPartenzeNotification(INotificationConfermaPartenze sender, ICallMatrix callMatrix)
        {
            _sender = sender;
            _callMatrix = callMatrix;
        }

        public void Notify(ConfermaPartenzeCommand command)
        {
            _sender.SendNotification(command);

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var messaggio = $"La squadra {partenza.Squadre[0].Nome} è partita alle ore {DateTime.Now.Hour}:{DateTime.Now.Minute} con il mezzo targato {partenza.Mezzo.Codice} per dirigersi a {command.ConfermaPartenze.richiesta.Localita.Indirizzo}. Codice Intervento: {command.ConfermaPartenze.richiesta.CodRichiesta}";
                var infoMatrix = new MessageMatrix()
                {
                    Messaggio = messaggio,
                    CodSede = command.ConfermaPartenze.CodiceSede.Split('.')[0]
                };
                _callMatrix.SendMessage(infoMatrix);
            }
        }
    }
}
