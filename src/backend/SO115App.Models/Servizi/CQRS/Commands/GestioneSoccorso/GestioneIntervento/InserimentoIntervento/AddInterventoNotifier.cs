//-----------------------------------------------------------------------
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
using SO115App.Models.Servizi.Infrastruttura.Notification.CallMatrix;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata;

namespace DomainModel.CQRS.Commands.AddIntervento
{
    public class AddInterventoNotifier : ICommandNotifier<AddInterventoCommand>
    {
        private readonly INotifyInserimentoChiamata _sender;
        private readonly ICallMatrix _callMatrix;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiRichiestaByCodice;

        public AddInterventoNotifier(INotifyInserimentoChiamata sender, ICallMatrix callMatrix,
            IGetSintesiRichiestaAssistenzaByCodice getSintesiRichiestaByCodice)
        {
            _sender = sender;
            _callMatrix = callMatrix;
            _getSintesiRichiestaByCodice = getSintesiRichiestaByCodice;
        }

        public void Notify(AddInterventoCommand command)
        {
            var sintesi = _getSintesiRichiestaByCodice.GetSintesi(command.Chiamata.Codice);

            _sender.SendNotification(command);
            _callMatrix.SendMessage(sintesi);
        }
    }
}
