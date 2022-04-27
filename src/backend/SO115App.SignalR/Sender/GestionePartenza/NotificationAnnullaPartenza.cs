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
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AnnullaStatoPartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationAnnullaPartenza : INotifyAnnullaPartenza
    {
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;

        public NotificationAnnullaPartenza(IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          GetGerarchiaToSend getGerarchiaToSend, IConfiguration config)
        {
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(AnnullaStatoPartenzaCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            var infoDaInviare = new List<InfoDaInviareAnnullaPartenza>();

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                var info = new InfoDaInviareAnnullaPartenza();
                //_notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);
                //_notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);

                Task.Run(() =>
                {
                    var boxRichiesteQuery = new BoxRichiesteQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    info.boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                });

                Task.Run(() =>
                {
                    var boxMezziQuery = new BoxMezziQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    info.boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;
                    //var boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                });

                Task.Run(() =>
                {
                    var boxPersonaleQuery = new BoxPersonaleQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };

                    info.boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;
                    //var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
                });

                Task.Run(() =>
                {
                    var listaMezziInServizioQuery = new ListaMezziInServizioQuery
                    {
                        CodiciSede = new string[] { sede },
                        IdOperatore = command.IdOperatore
                    };

                    info.listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).DataArray;
                    info.mezzo = info.listaMezziInServizio.Find(x => x.Mezzo.Mezzo.Codice.Equals(command.TargaMezzo));

                    infoDaInviare.Add(info);

                    //var listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).DataArray;
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetListaMezziInServizio", listaMezziInServizio);
                    //var mezzo = listaMezziInServizio.Find(x => x.Mezzo.Mezzo.Codice.Equals(command.TargaMezzo));
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", mezzo);
                });
            });

            Parallel.ForEach(infoDaInviare, info =>
            {
                hubConnection.StartAsync();
                hubConnection.InvokeAsync("ModifyAndNotifySuccessAnnullaPartenza", command, info.codiceSede);
                hubConnection.InvokeAsync("ChangeStateSuccess", true, info.codiceSede);
                hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.codiceSede);
                hubConnection.InvokeAsync("NotifyGetBoxMezzi", info.boxMezzi, info.codiceSede);
                hubConnection.InvokeAsync("NotifyGetBoxPersonale", info.boxPersonale, info.codiceSede);
                hubConnection.InvokeAsync("NotifyGetListaMezziInServizio", info.listaMezziInServizio, info.codiceSede);
                hubConnection.InvokeAsync("NotifyUpdateMezzoInServizio", info.mezzo, info.codiceSede);
                hubConnection.StopAsync();
            });
        }
    }

    internal class InfoDaInviareAnnullaPartenza
    {
        public string codiceSede { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public BoxMezzi boxMezzi { get; set; }
        public BoxPersonale boxPersonale { get; set; }
        public List<MezzoInServizio> listaMezziInServizio { get; set; }
        public MezzoInServizio mezzo { get; set; }
    }
}
