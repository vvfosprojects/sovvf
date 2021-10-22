//-----------------------------------------------------------------------
// <copyright file="NotificationSetSchedaGestita.cs" company="CNVVF">
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
using SO115App.Models.Servizi.CQRS.Commands.GestioneSchedeNue.SetSchedaGestita;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetContatoreSchede;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSchedeNue.GetSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneSchedeContatto
{
    public class NotificationSetSchedaGestita : INotificationSetSchedaGestita
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        private readonly IGetConteggioSchede _getConteggioSchede;
        private readonly IGetSchedeContatto _getSchedeContatto;

        public NotificationSetSchedaGestita(
            IHubContext<NotificationHub> notificationHubContext,
            IGetConteggioSchede getConteggioSchede,
            IGetSchedeContatto getSchedeContatto)
        {
            _notificationHubContext = notificationHubContext;
            _getConteggioSchede = getConteggioSchede;
            _getSchedeContatto = getSchedeContatto;
        }

        public async Task SendNotification(SetSchedaGestitaCommand command)
        {
            var schedaContattoUpdated = _getSchedeContatto.ListaSchedeContatto(command.CodiceSede).Find(x => x.CodiceScheda.Equals(command.Scheda.CodiceScheda));
            var infoNue = _getConteggioSchede.GetConteggio(new string[] { command.CodiceSede });

            await _notificationHubContext.Clients.All.SendAsync("NotifySetContatoriSchedeContatto", infoNue);
            await _notificationHubContext.Clients.All.SendAsync("NotifyUpdateSchedaContatto", schedaContattoUpdated);
        }
    }
}
