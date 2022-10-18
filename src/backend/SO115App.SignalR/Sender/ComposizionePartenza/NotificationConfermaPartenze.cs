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
using DomainModel.CQRS.Commands.ConfermaPartenze;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.NotificaSoundModale;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.SignalR.Sender.AggiornamentoBox;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationConfermaPartenze : INotificationConfermaPartenze
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetSedi _getSedi;
        private readonly GetSediPartenze _getSediPartenze;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;

        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IGetMezziInServizio _getListaMezzi;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
            IMapperRichiestaSuSintesi mapperSintesi,
            GetGerarchiaToSend getGerarchiaToSend, IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC, IGetMezziInServizio getListaMezzi,
            IGetSedi getSedi, GetSediPartenze getSediPartenze)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getListaMezzi = getListaMezzi;
            _notificationHubContext = notificationHubContext;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _mapperSintesi = mapperSintesi;
            _getDistaccamentoUC = getDistaccamentoUC;
            _getSedi = getSedi;
            _getSediPartenze = getSediPartenze;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            Stopwatch stopWatch = new Stopwatch();
            Log.Information($"NOTIFICA CONFERMA PARTENZA ********** Inizio invio Notifiche Conferma Partenza {DateTime.Now} **************");
            stopWatch.Start();
            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = new List<string>();
            if (conferma.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(conferma.Richiesta.CodSOCompetente, conferma.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(conferma.Richiesta.CodSOCompetente);

            SediDaNotificare.AddRange(_getSediPartenze.GetFromRichiesta(conferma.Richiesta));

            //Sedi dei mezzi in partenza che dovranno ricevere la notifica
            //SediDaNotificare.Add("00"); //AGGIUNGO IL CON ALLA NOTFICA

            SediDaNotificare = SediDaNotificare.Distinct().ToList();

            Log.Information($"NOTIFICA CONFERMA PARTENZA ********** Fine Lista sedi da notificare Elapsed Time:{stopWatch.ElapsedMilliseconds} **************");

            var listaMezziInServizio = _getListaMezzi.MapPartenzeInMezziInServizio(conferma.Richiesta, SediDaNotificare.ToArray());

            Log.Information($"NOTIFICA CONFERMA PARTENZA ********** Fine Lista mezzi in servizio Elapsed Time:{stopWatch.ElapsedMilliseconds} **************");

            var result = listaMezziInServizio;
            var sintesi = Task.Factory.StartNew(() => _mapperSintesi.Map(conferma.Richiesta)).ContinueWith(sintesi =>
            {
                sintesi.Result.Competenze = conferma.Richiesta.CodUOCompetenza != null ? conferma.Richiesta.CodUOCompetenza.MapCompetenze(_getSedi) : null;
                conferma.ConfermaPartenze.Chiamata = sintesi.Result;
                sintesi.Result.Motivazione = sintesi.Result.Descrizione;

                return sintesi.Result;
            });

            Parallel.ForEach(conferma.ConfermaPartenze.Partenze, partenza =>
            {
                var notificaModal = new DataModal()
                {
                    buttons = new List<Button>()
                        {
                            new Button()
                            {
                                bgColor = "danger",
                                text = "chiudi"
                            }
                        },
                    text = "Nuova partenza distaccamento",
                    timeToClose = 15000,
                    title = "Alert Distaccamento"
                };

                var notificaSound = new Notifica()
                {
                    NotificaType = TipoNotifica.NuovaPartenzaDistaccamento
                };

                _notificationHubContext.Clients.Group(partenza.Mezzo.Distaccamento.Codice).SendAsync("NotifyAvvisoModal", notificaModal);

                _notificationHubContext.Clients.Group(partenza.Mezzo.Distaccamento.Codice).SendAsync("NotifySound", notificaSound);
            });

            Parallel.ForEach(SediDaNotificare, sede =>
            {
                if (sede != null)
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);

                    var CodSede = new string[] { sede };

                    foreach (var partenze in conferma.ConfermaPartenze.Partenze)
                    {
                        _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", result.Find(x => x.Mezzo.Mezzo.Codice.Equals(partenze.Mezzo.Codice)));
                    }

                    conferma.ConfermaPartenze.Chiamata = sintesi.Result;
                    _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);

                    var boxPersonale = _boxPersonalehandler.Handle(boxPersonaleQuery).BoxPersonale;
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);

                    if (conferma.ConfermaPartenze.IdRichiestaDaSganciare != null)
                    {
                        Task.Factory.StartNew(() =>
                        {
                            var sintesiSganciata = _mapperSintesi.Map(conferma.RichiestaDaSganciare);
                            sintesiSganciata.Competenze = conferma.Richiesta.CodUOCompetenza != null ? conferma.Richiesta.CodUOCompetenza.MapCompetenze(_getSedi) : null;
                            conferma.ConfermaPartenze.Chiamata = sintesiSganciata;
                            _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
                        });
                    }

                    Parallel.ForEach(conferma.ConfermaPartenze.Partenze, partenza =>
                   {
                       var counterCodaChiamate = new CounterNotifica()
                       {
                           codDistaccamento = partenza.Mezzo.Distaccamento.Codice,
                           count = partenza.Squadre.Count
                       };

                       _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddSquadreOccupateCodaChiamate", counterCodaChiamate);
                       _notificationHubContext.Clients.Group(sede).SendAsync("NotifyRemoveSquadreLibereCodaChiamate", counterCodaChiamate);
                   });
                }

                Log.Information($"NOTIFICA CONFERMA PARTENZA ********** Fine invio Notifica Conferma Partenza sede {sede} Elapsed Time:{stopWatch.ElapsedMilliseconds} **************");
            });

            stopWatch.Stop();
            Log.Information($"NOTIFICA CONFERMA PARTENZA ********** Fine invio Notifiche Conferma Partenza Elapsed Time:{stopWatch.ElapsedMilliseconds} **************");
        }
    }
}
