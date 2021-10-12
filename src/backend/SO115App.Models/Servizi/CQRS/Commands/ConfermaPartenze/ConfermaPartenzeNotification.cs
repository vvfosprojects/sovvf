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
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.Matrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System;

namespace DomainModel.CQRS.Commands.ConfermaPartenze
{
    public class ConfermaPartenzeNotification : ICommandNotifier<ConfermaPartenzeCommand>
    {
        private readonly INotificationConfermaPartenze _sender;
        private readonly ICallMatrix _callMatrix;
        private readonly INotifyUpDateRichiesta _notifyUpDateRichiesta;

        public ConfermaPartenzeNotification(INotificationConfermaPartenze sender,
                                            ICallMatrix callMatrix,
                                            INotifyUpDateRichiesta notifyUpDateRichiesta)
        {
            _sender = sender;
            _callMatrix = callMatrix;
            _notifyUpDateRichiesta = notifyUpDateRichiesta;
        }

        public void Notify(ConfermaPartenzeCommand command)
        {
            _sender.SendNotification(command);

            var infoESRI = new ESRI_RichiestaMessage()
            {
                geometry = new geometry()
                {
                    x = command.Richiesta.Localita.Coordinate.Longitudine,
                    y = command.Richiesta.Localita.Coordinate.Latitudine
                },
                attributes = new attributes()
                {
                    objectId = command.Richiesta.Esri_Param.ObjectId,
                    mongodb_id = command.Richiesta.Id,
                    categoria = command.Richiesta.Tipologie[0],
                    codice = command.Richiesta.CodRichiesta,
                    descrizione = command.Richiesta.Descrizione,
                    stato = command.Richiesta.TestoStatoRichiesta
                }
            };

            _notifyUpDateRichiesta.UpDate(infoESRI);

            foreach (var partenza in command.ConfermaPartenze.Partenze)
            {
                var messaggio = $"La squadra {partenza.Squadre[0].Nome} è partita alle ore {DateTime.Now.Hour}:{DateTime.Now.Minute} dalla sede {partenza.Mezzo.Distaccamento.Descrizione} con il mezzo targato {partenza.Mezzo.Codice} per dirigersi a {command.Richiesta.Localita.Indirizzo}. Codice Intervento: {command.Richiesta.CodRichiesta}";
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
