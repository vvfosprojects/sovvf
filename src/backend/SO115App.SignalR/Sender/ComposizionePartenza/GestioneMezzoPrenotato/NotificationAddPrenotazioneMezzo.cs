//-----------------------------------------------------------------------
// <copyright file="NotificationAddPrenotazioneMezzo.cs" company="CNVVF">
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

using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.SetMezzoPrenotato;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GestioneMezzoPrenotato;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza.MezzoPrenotato;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza.GestioneMezzoPrenotato
{
    public class NotificationAddPrenotazioneMezzo : INotificationAddPrenotazioneMezzo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<GetMezziPrenotatiQuery, GetMezzoPrenotatoResult> _mezzoPrenotatoHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAddPrenotazioneMezzo(IHubContext<NotificationHub> NotificationHubContext,
            IQueryHandler<GetMezziPrenotatiQuery, GetMezzoPrenotatoResult> mezzoPrenotatoHandler,
            GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = NotificationHubContext;
            _mezzoPrenotatoHandler = mezzoPrenotatoHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(SetMezzoPrenotatoCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.MezzoPrenotato.CodiceSede);

            var mezziPrenotatiQuery = new GetMezziPrenotatiQuery
            {
                CodiceSede = command.MezzoPrenotato.CodiceSede
            };

            var mezzoPrenotato = _mezzoPrenotatoHandler.Handle(mezziPrenotatiQuery).MezziPrenotati.Find(x => x.CodiceMezzo.Equals(command.MezzoPrenotato.CodiceMezzo));

            if (mezzoPrenotato == null)
            {
                var mezzoLibero = new StatoOperativoMezzo
                {
                    CodiceMezzo = command.MezzoPrenotato.CodiceMezzo,
                    SbloccaMezzo = true
                };

                foreach (var sede in SediDaNotificare)
                {
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddPrenotazioneMezzo", mezzoLibero).ConfigureAwait(false);
                }
            }
            else
            {
                foreach (var sede in SediDaNotificare)
                {
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddPrenotazioneMezzo", mezzoPrenotato).ConfigureAwait(false);
                }
            }
        }
    }
}
