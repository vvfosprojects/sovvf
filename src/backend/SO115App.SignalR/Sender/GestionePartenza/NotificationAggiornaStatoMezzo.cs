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
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.MezziMarker;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationAggiornaStatoMezzo : INotifyAggiornaStatoMezzo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperRichiesta;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;

        public NotificationAggiornaStatoMezzo(IHubContext<NotificationHub> notificationHubContext,
                                          IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          IMapperRichiestaSuSintesi mapperRichiesta)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _mapperRichiesta = mapperRichiesta;
        }

        public async Task SendNotification(AggiornaStatoMezzoCommand intervento)
        {
            var SediDaNotificare = intervento.CodiciSede.ToList();
            if (intervento.Richiesta.CodSOAllertate != null)
                SediDaNotificare.AddRange(_getGerarchiaToSend.Get(intervento.Richiesta.CodSOCompetente, intervento.Richiesta.CodSOAllertate.ToArray()));
            else
                SediDaNotificare.AddRange(_getGerarchiaToSend.Get(intervento.Richiesta.CodSOCompetente));

            var sintesiRichiesteAssistenzaQuery = new SintesiRichiesteAssistenzaQuery
            {
                Filtro = new FiltroRicercaRichiesteAssistenza
                {
                    idOperatore = intervento.IdUtente,
                    PageSize = 99,
                    IncludiRichiesteChiuse = true
                },
                CodiciSede = SediDaNotificare.ToArray()
            };

            intervento.Chiamata = _mapperRichiesta.Map(intervento.Richiesta);

            var listaMezziInServizioQuery = new ListaMezziInServizioQuery
            {
                CodiciSede = intervento.CodiciSede,
                IdOperatore = intervento.IdUtente
            };
            var listaMezziInServizio = _listaMezziInServizioHandler.Handle(listaMezziInServizioQuery).DataArray;
            var mezzo = listaMezziInServizio.Find(x => x.Mezzo.Mezzo.Codice.Equals(intervento.IdMezzo));

            foreach (var sede in listaMezziInServizioQuery.CodiciSede)
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", mezzo);

            Parallel.ForEach(SediDaNotificare.Distinct(), sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", intervento);
                _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);

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
                    var boxRichiesteQuery = new BoxRichiesteQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    var boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                });

                Task.Factory.StartNew(() =>
                {
                    var boxPersonaleQuery = new BoxPersonaleQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    var boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);

                    var counterCodaChiamate = new CounterNotifica()
                    {
                        codDistaccamento = intervento.Richiesta.Partenze.ToList().Find(x => x.CodiceMezzo.Equals(intervento.IdMezzo)).Partenza.Mezzo.Distaccamento.Codice,
                        count = intervento.Richiesta.Partenze.ToList().Find(x => x.CodiceMezzo.Equals(intervento.IdMezzo)).Partenza.Squadre.Count
                    };

                    if (intervento.StatoMezzo.Equals("InSede") || intervento.StatoMezzo.Equals("Rientrato"))
                    {
                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddSquadreLibereCodaChiamate", counterCodaChiamate);
                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyRemoveSquadreOccupateCodaChiamate", counterCodaChiamate);
                    }
                    else
                    {
                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddSquadreOccupateCodaChiamate", counterCodaChiamate);
                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyRemoveSquadreLibereCodaChiamate", counterCodaChiamate);
                    }
                });

                //if (intervento.Chiamata != null)
                //{
                //    Task.Factory.StartNew(() =>
                //    {
                //        var sintesiRichiesteAssistenzaMarkerQuery = new SintesiRichiesteAssistenzaMarkerQuery()
                //        {
                //            CodiciSedi = new string[] { sede }
                //        };
                //        var listaSintesiMarker = _sintesiRichiesteAssistenzaMarkerhandler.Handle(sintesiRichiesteAssistenzaMarkerQuery).SintesiRichiestaMarker;
                //        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetRichiestaUpDateMarker", listaSintesiMarker.LastOrDefault(marker => marker.Codice == intervento.Chiamata.Codice));
                //    });

                //    Task.Factory.StartNew(() =>
                //    {
                //        var queryListaMezzi = new MezziMarkerQuery()
                //        {
                //            Filtro = new AreaMappa()
                //            {
                //                CodiceSede = new List<string>() { sede },
                //                FiltroMezzi = new Models.Classi.Filtri.FiltroMezzi()
                //                {
                //                    FiltraPerAreaMappa = false
                //                }
                //            }
                //        };
                //        var listaMezziMarker = _listaMezziMarkerHandler.Handle(queryListaMezzi).ListaMezziMarker;
                //        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetMezzoUpDateMarker", listaMezziMarker.LastOrDefault(marker => marker.Mezzo.IdRichiesta == intervento.Chiamata.Codice));
                //    });
                //}
            });
        }
    }
}
