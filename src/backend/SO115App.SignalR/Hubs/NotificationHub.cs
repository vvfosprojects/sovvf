//-----------------------------------------------------------------------
// <copyright file="NotificationHub.cs" company="CNVVF">
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
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.SignalR.Notifications;

namespace SO115App.SignalR
{
    public class NotificationHub : Hub
    {
        public async Task AddToGroup(Notification<Utente> utente)
        {
            foreach (var codiceSede in utente.CodiciSede)
            {
                try
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, codiceSede).ConfigureAwait(false);

                    //Notifico a tutti i client che l'utente si è appena loggato
                    await Clients.OthersInGroup(codiceSede).SendAsync("NotifyLogIn", "L'utente " + utente.NominativoUtente + " è stato inserito nella sede " + codiceSede);
                }
                catch (Exception ex)
                {
                    await Clients.Caller.SendAsync("NotifyLogIn", ex.Message).ConfigureAwait(false);
                }
            }

            await base.OnConnectedAsync();
        }

        public async Task RemoveToGroup(Notification<Utente> utente)
        {
            foreach (var codiceSede in utente.CodiciSede)
            {
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, codiceSede).ConfigureAwait(false);
                await Clients.OthersInGroup(codiceSede).SendAsync("NotifyLogOut", "L'utente " + utente.NominativoUtente + " è uscito dalla sede " + codiceSede).ConfigureAwait(false);
                await base.OnConnectedAsync().ConfigureAwait(false);
            }
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public long GetDateTime()
        {
            return DateTimeOffset.Now.ToUnixTimeMilliseconds();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var id = Context.ConnectionId;

            await base.OnDisconnectedAsync(exception);
        }
    }
}
