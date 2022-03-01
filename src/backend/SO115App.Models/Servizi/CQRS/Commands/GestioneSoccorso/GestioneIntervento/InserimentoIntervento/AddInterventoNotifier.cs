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
using Serilog;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.ESRI;
using SO115App.Models.Classi.Matrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;
using System.Threading.Tasks;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoNotifier : ICommandNotifier<AddInterventoCommand>
    {
        private readonly INotifyInserimentoChiamata _sender;
        private readonly ICallMatrix _callMatrix;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;
        private readonly INotify_ESRIAddRichiesta _notify_ESRIAddRichiesta;
        private readonly IMappingESRIMessage _mappingESRIMessage;

        public AddInterventoNotifier(INotifyInserimentoChiamata sender,
                                     ICallMatrix callMatrix,
                                     IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice,
                                     INotify_ESRIAddRichiesta notify_ESRIAddRichiesta,
                                     IMappingESRIMessage mappingESRIMessage)
        {
            _sender = sender;
            _callMatrix = callMatrix;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
            _notify_ESRIAddRichiesta = notify_ESRIAddRichiesta;
            _mappingESRIMessage = mappingESRIMessage;
        }

        public void Notify(AddInterventoCommand command)
        {
            var sintesi = _getSintesiRichiestaByCodice.GetSintesi(command.Chiamata.Codice);

            command.sintesi = sintesi;
            _sender.SendNotification(command);

            Task.Run(() =>
            {
                Log.Information("ESRI - Inizio mappatura messaggio");
                var infoESRI = _mappingESRIMessage.Map(sintesi);

                Log.Information("ESRI - Chiamo servizio inserimento marker nuova chiamata");
                _notify_ESRIAddRichiesta.Call(infoESRI, command.Intervento);
                Log.Information("ESRI - Fine Chiamata servizio inserimento marker nuova chiamata");

                Log.Information("Matrix - Inizio chiamata servizio Matrix");
                var messaggio = $"E' stato richiesto un intervento in {sintesi.Localita.Indirizzo}. Codice Intervento: {sintesi.Codice}";
                var infoMatrix = new MessageMatrix()
                {
                    Messaggio = messaggio,
                    CodSede = sintesi.CodSOCompetente.Split('.')[0]
                };
                _callMatrix.SendMessage(infoMatrix);
                Log.Information("Matrix - Fine chiamata servizio Matrix");
            });
        }
    }
}
