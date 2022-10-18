//-----------------------------------------------------------------------
// <copyright file="NotificationUpDateChiamata.cs" company="CNVVF">
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
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaStatoPartenza;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.SignalR.Sender.AggiornamentoBox;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationAnnullaPartenza : INotifyAnnullaPartenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly GetSediPartenze _getSediPartenze;

        public NotificationAnnullaPartenza(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          GetSediPartenze getSediPartenze)
        {
            _notificationHubContext = notificationHubContext;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSediPartenze = getSediPartenze;
        }

        public async Task SendNotification(AnnullaStatoPartenzaCommand command)
        {
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            SediDaNotificare.AddRange(_getSediPartenze.GetFromRichiesta(command.Richiesta));
            //SediDaNotificare.Add("00"); //AGGIUNGO IL CON ALLA NOTFICA

            Parallel.ForEach(SediDaNotificare.Distinct(), sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);
                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);

                var listaMezziInServizioQuery = new ListaMezziInServizioQuery
                {
                    CodiciSede = new string[] { sede },
                    IdOperatore = command.IdOperatore
                };
                var listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).DataArray;
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetListaMezziInServizio", listaMezziInServizio);
                var mezzo = listaMezziInServizio.Find(x => x.Mezzo.Mezzo.Codice.Equals(command.TargaMezzo));
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", mezzo);
            });
        }
    }
}
