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
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Composizione;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.CQRS.Queries.Marker.SintesiRichiesteAssistenzaMarker;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Classi.Utility;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationConfermaPartenze : IDeleteNotification
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetSedi _getSedi;
        private readonly IConfiguration _config;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiestehandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezzihandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonalehandler;
        private readonly IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> _sintesiRichiesteAssistenzaMarkerhandler;

        private readonly IGetDistaccamentoByCodiceSedeUC _getDistaccamentoUC;
        private readonly IGetMezziInServizio _getListaMezzi;

        public NotificationConfermaPartenze(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezzihandler,
            IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonalehandler,
            IQueryHandler<SintesiRichiesteAssistenzaMarkerQuery, SintesiRichiesteAssistenzaMarkerResult> sintesiRichiesteAssistenzaMarkerhandler,
            IMapperRichiestaSuSintesi mapperSintesi,
            GetGerarchiaToSend getGerarchiaToSend, IGetDistaccamentoByCodiceSedeUC getDistaccamentoUC, IGetMezziInServizio getListaMezzi,
            IGetSedi getSedi, IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getListaMezzi = getListaMezzi;
            _notificationHubContext = notificationHubContext;
            _boxRichiestehandler = boxRichiestehandler;
            _boxMezzihandler = boxMezzihandler;
            _boxPersonalehandler = boxPersonalehandler;
            _sintesiRichiesteAssistenzaMarkerhandler = sintesiRichiesteAssistenzaMarkerhandler;
            _mapperSintesi = mapperSintesi;
            _getDistaccamentoUC = getDistaccamentoUC;
            _getSedi = getSedi;
            _config = config;
        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = new List<string>();
            if (conferma.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(conferma.Richiesta.CodSOCompetente, conferma.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(conferma.Richiesta.CodSOCompetente);

            //Sedi dei mezzi in partenza che dovranno ricevere la notifica
            //SediDaNotificare.AddRange(conferma.ConfermaPartenze.Partenze.Select(c => c.Mezzo.Distaccamento.Codice));
            SediDaNotificare = SediDaNotificare.Distinct().ToList();

            var listaMezziInServizio = Task.Factory.StartNew(() => _getListaMezzi.Get(SediDaNotificare.ToArray()));
            var sintesi = Task.Factory.StartNew(() => _mapperSintesi.Map(conferma.Richiesta)).ContinueWith(sintesi =>
            {
                sintesi.Result.Competenze = conferma.Richiesta.CodUOCompetenza.MapCompetenze(_getSedi);
                conferma.ConfermaPartenze.Chiamata = sintesi.Result;
                sintesi.Result.Motivazione = sintesi.Result.Descrizione;

                return sintesi.Result;
            });

            try
            {
                var listaInfoDaSperide = new List<InfoDaSpedirePerConferma>();
                Parallel.ForEach(SediDaNotificare, sede =>
                {
                    InfoDaSpedirePerConferma info = new InfoDaSpedirePerConferma();

                    if (sede != null)
                    {
                        var CodSede = new string[] { sede };

                        //_notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);

                        Task.Factory.StartNew(() =>
                        {
                            var boxRichiesteQuery = new BoxRichiesteQuery()
                            {
                                CodiciSede = new string[] { sede }
                            };
                            var boxInterventi = _boxRichiestehandler.Handle(boxRichiesteQuery).BoxRichieste;
                            info.boxInterventi = boxInterventi;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                        });

                        Task.Factory.StartNew(() =>
                        {
                            var boxMezziQuery = new BoxMezziQuery()
                            {
                                CodiciSede = new string[] { sede }
                            };
                            var boxMezzi = _boxMezzihandler.Handle(boxMezziQuery).BoxMezzi;
                            info.boxMezzi = boxMezzi;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);
                        });

                        Task.Factory.StartNew(() =>
                        {
                            var boxPersonaleQuery = new BoxPersonaleQuery()
                            {
                                CodiciSede = new string[] { sede }
                            };
                            var boxPersonale = _boxPersonalehandler.Handle(boxPersonaleQuery).BoxPersonale;
                            info.boxPersonale = boxPersonale;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
                        });

                        Task.Factory.StartNew(() =>
                        {
                            foreach (var partenze in conferma.ConfermaPartenze.Partenze)
                            {
                                var result = listaMezziInServizio.Result;
                                info.mezzoInServizio = result.Find(x => x.Mezzo.Mezzo.Codice.Equals(partenze.Mezzo.Codice));
                                //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", result.Find(x => x.Mezzo.Mezzo.Codice.Equals(partenze.Mezzo.Codice)));
                            }
                        });

                        conferma.ConfermaPartenze.Chiamata = sintesi.Result;
                        info.conferma = conferma.ConfermaPartenze;
                        //_notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);

                        if (conferma.ConfermaPartenze.IdRichiestaDaSganciare != null)
                        {
                            Task.Factory.StartNew(() =>
                            {
                                var sintesiSganciata = _mapperSintesi.Map(conferma.RichiestaDaSganciare);
                                sintesiSganciata.Competenze = conferma.Richiesta.CodUOCompetenza.MapCompetenze(_getSedi);
                                conferma.ConfermaPartenze.Chiamata = sintesiSganciata;
                                info.confermaSganciamento = conferma.ConfermaPartenze;
                                //_notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
                            });
                        }

                        foreach (var partenza in conferma.ConfermaPartenze.Partenze)
                        {
                            var counterCodaChiamate = new CounterNotifica()
                            {
                                codDistaccamento = partenza.Mezzo.Distaccamento.Codice,
                                count = partenza.Squadre.Count
                            };

                            info.counterCodaChiamate = counterCodaChiamate;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddSquadreOccupateCodaChiamate", counterCodaChiamate);
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyRemoveSquadreLibereCodaChiamate", counterCodaChiamate);
                        }
                    }

                    listaInfoDaSperide.Add(info);
                });

                foreach (var info in listaInfoDaSperide)
                {
                    await hubConnection.StartAsync();
                    await hubConnection.InvokeAsync("ModifyAndNotifySuccess", info.conferma);

                    if (conferma.ConfermaPartenze.IdRichiestaDaSganciare != null)
                        await hubConnection.InvokeAsync("ModifyAndNotifySuccess", info.confermaSganciamento);

                    await hubConnection.InvokeAsync("ChangeStateSuccess", true, info.codSede);
                    await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.codSede);
                    await hubConnection.InvokeAsync("NotifyGetBoxMezzi", info.boxMezzi, info.codSede);
                    await hubConnection.InvokeAsync("NotifyGetBoxPersonale", info.boxPersonale, info.codSede);
                    await hubConnection.InvokeAsync("NotifyUpdateMezzoInServizio", info.mezzoInServizio, info.codSede);
                    await hubConnection.InvokeAsync("NotifyAddSquadreOccupateCodaChiamate", info.counterCodaChiamate, info.codSede);
                    await hubConnection.InvokeAsync("NotifyRemoveSquadreLibereCodaChiamate", info.counterCodaChiamate, info.codSede);
                    await hubConnection.StopAsync();
                }
            }
            catch
            {
                await hubConnection.StopAsync();
            }
        }
    }

    internal class InfoDaSpedirePerConferma
    {
        public string codSede { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public BoxPersonale boxPersonale { get; set; }
        public BoxMezzi boxMezzi { get; set; }
        public MezzoInServizio mezzoInServizio { get; set; }
        public CounterNotifica counterCodaChiamate { get; set; }
        public ConfermaPartenze conferma { get; set; }
        public ConfermaPartenze confermaSganciamento { get; set; }
    }
}
