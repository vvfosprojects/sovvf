﻿//-----------------------------------------------------------------------
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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.Matrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Commands.ConfermaPartenze
{
    public class ConfermaPartenzeNotification : ICommandNotifier<ConfermaPartenzeCommand>
    {
        private readonly IDeleteNotification _sender;
        private readonly ICallMatrix _callMatrix;
        private readonly INotifyUpDateRichiesta _notifyUpDateRichiesta;
        private readonly IMappingESRIMessage _mappingESRIMessage;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        public ConfermaPartenzeNotification(IDeleteNotification sender,
                                            ICallMatrix callMatrix,
                                            INotifyUpDateRichiesta notifyUpDateRichiesta,
                                            IMappingESRIMessage mappingESRIMessage,
                                            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _sender = sender;
            _callMatrix = callMatrix;
            _notifyUpDateRichiesta = notifyUpDateRichiesta;
            _mappingESRIMessage = mappingESRIMessage;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        public void Notify(ConfermaPartenzeCommand command)
        {
            var sintesi = _getSintesiRichiestaByCodice.GetSintesi(command.Richiesta.Codice);
            _sender.SendNotification(command);

            Task.Factory.StartNew(() =>
            {
                var infoESRI = _mappingESRIMessage.Map(sintesi);
                _notifyUpDateRichiesta.UpDate(infoESRI);
            });

            Task.Factory.StartNew(() =>
            {
                Parallel.ForEach(command.ConfermaPartenze.Partenze, partenza =>
                {
                    var messaggio = $"La squadra {partenza.Squadre[0].Nome} è partita alle ore {DateTime.Now.Hour}:{DateTime.Now.Minute} dalla sede {partenza.Mezzo.Distaccamento.Descrizione} con il mezzo targato {partenza.Mezzo.Codice} per dirigersi a {command.Richiesta.Localita.Indirizzo}. Codice Intervento: {command.Richiesta.CodRichiesta}";
                    var infoMatrix = new MessageMatrix()
                    {
                        Messaggio = messaggio,
                        CodSede = command.ConfermaPartenze.CodiceSede.Split('.')[0]
                    };
                    _callMatrix.SendMessage(infoMatrix);
                });
            });
        }
    }
}
