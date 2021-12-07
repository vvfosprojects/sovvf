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
using SO115App.API.Models.Classi.Geo;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.MezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
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
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> _sintesiRichiesteAssistenzahandler;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;
        private readonly IQueryHandler<MezziMarkerQuery, MezziMarkerResult> _listaMezziMarkerHandler;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAnnullaPartenza(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
                                          IQueryHandler<SintesiRichiesteAssistenzaQuery, SintesiRichiesteAssistenzaResult> sintesiRichiesteAssistenzahandler,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          IQueryHandler<MezziMarkerQuery, MezziMarkerResult> listaMezziMarkerHandler,
                                          GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _sintesiRichiesteAssistenzahandler = sintesiRichiesteAssistenzahandler;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _listaMezziMarkerHandler = listaMezziMarkerHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(AnnullaStatoPartenzaCommand command)
        {
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                Task.Factory.StartNew(() =>
                {
                    var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
                    {
                        Filtro = new FiltroRicercaRichiesteAssistenza
                        {
                            idOperatore = command.IdOperatore,
                            PageSize = 99
                        },
                        CodiciSede = new string[] { sede }
                    };
                    var listaSintesi = _sintesiRichiesteAssistenzahandler.Handle(sintesiRichiesteAssistenzaQuery).SintesiRichiesta;
                    command.Chiamata = listaSintesi.LastOrDefault(richiesta => richiesta.Id == command.CodiceRichiesta);
                    var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                    {
                        CodiciSedi = new string[] { sede }
                    };
                    var listaSintesiMarker = _sintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == command.Chiamata.Codice));
                    return command.Chiamata;
                }).ContinueWith(chiamata => _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command));

                Task.Factory.StartNew(() =>
                {
                    var boxRichiesteQuery = new BoxRichiesteQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                });

                Task.Factory.StartNew(() =>
                {
                    var boxMezziQuery = new BoxMezziQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    var boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                });

                Task.Factory.StartNew(() =>
                {
                    var boxPersonaleQuery = new BoxPersonaleQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
                });

                Task.Factory.StartNew(() =>
                {
                    var listaMezziInServizioQuery = new ListaMezziInServizioQuery
                    {
                        CodiciSede = new string[] { sede },
                        IdOperatore = command.IdOperatore
                    };
                    var listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).DataArray;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetListaMezziInServizio", listaMezziInServizio);
                });

                Task.Factory.StartNew(() =>
                {
                    var areaMappa = new AreaMappa()
                    {
                        CodiceSede = new List<string>() { sede },
                        FiltroMezzi = new Models.Classi.Filtri.FiltroMezzi()
                        {
                            FiltraPerAreaMappa = false
                        }
                    };
                    var queryListaMezzi = new MezziMarkerQuery()
                    {
                        Filtro = areaMappa,
                    };
                    var listaMezziMarker = _listaMezziMarkerHandler.Handle(queryListaMezzi).ListaMezziMarker;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetMezzoUpDateMarker", listaMezziMarker.LastOrDefault(marker => marker.Mezzo.IdRichiesta == command.Chiamata.Codice));
                });


                _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);
            });
        }
    }
}
