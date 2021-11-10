//-----------------------------------------------------------------------
// <copyright file="AllertaNotifier.cs" company="CNVVF">
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
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;

namespace SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.Allerta
{
    public class AllertaNotifier : ICommandNotifier<AllertaCommand>
    {
        private readonly ICallMatrix _callMatrix;
        private readonly INotifyUpDateEmergenza _sender;
        private readonly INotify_ESRIAddRichiesta _notify_ESRIAddRichiesta;
        private readonly IMappingESRIMessage _mappingESRIMessage;

        public AllertaNotifier(
                                     ICallMatrix callMatrix,
                                     INotifyUpDateEmergenza sender,
                                     INotify_ESRIAddRichiesta notify_ESRIAddRichiesta,
                                     IMappingESRIMessage mappingESRIMessage)
        {
            _callMatrix = callMatrix;
            _sender = sender;
            _notify_ESRIAddRichiesta = notify_ESRIAddRichiesta;
            _mappingESRIMessage = mappingESRIMessage;
        }

        public void Notify(AllertaCommand command)
        {
            _sender.Send(command.InfoEmergenza);

            //var infoESRI = _mappingESRIMessage.Map(sintesi);
            //_notify_ESRIAddRichiesta.Call(infoESRI, command.Intervento);

            var messaggio = $"E' stato richiesto l'internvento per l'emergenza codice {command.InfoEmergenza.CodEmergenza}. Coordinate: x:{command.InfoEmergenza.Localita.Coordinate.Longitudine} y:{command.InfoEmergenza.Localita.Coordinate.Latitudine}";
            var infoMatrix = new MessageMatrix()
            {
                Messaggio = messaggio,
                CodSede = command.InfoEmergenza.CodComandoRichiedente
            };
            _callMatrix.SendMessage(infoMatrix);
        }
    }
}
