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
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneMezziInServizio.ListaMezziInSerivizio;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.ListaMezziInServizio;
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
        private readonly IMapperRichiestaSuSintesi _mapperRichiesta;
        private readonly IConfiguration _config;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezziHandler;
        private readonly IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> _boxPersonaleHandler;
        private readonly IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> _listaMezziInServizioHandler;

        public NotificationAggiornaStatoMezzo(IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
                                          IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezziHandler,
                                          IQueryHandler<BoxPersonaleQuery, BoxPersonaleResult> boxPersonaleHandler,
                                          IQueryHandler<ListaMezziInServizioQuery, ListaMezziInServizioResult> listaMezziInServizioHandler,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          IMapperRichiestaSuSintesi mapperRichiesta, IConfiguration config)
        {
            _boxRichiesteHandler = boxRichiesteHandler;
            _boxMezziHandler = boxMezziHandler;
            _boxPersonaleHandler = boxPersonaleHandler;
            _listaMezziInServizioHandler = listaMezziInServizioHandler;
            _getGerarchiaToSend = getGerarchiaToSend;
            _mapperRichiesta = mapperRichiesta;
            _config = config;
        }

        public async Task SendNotification(AggiornaStatoMezzoCommand intervento)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

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

            var infoDaInviare = new List<InfoDaInviareAggiornaStatoMezzo>();

            Parallel.ForEach(SediDaNotificare.Distinct(), sede =>
            {
                var info = new InfoDaInviareAggiornaStatoMezzo();

                info.codiceSede = sede;

                Task.Factory.StartNew(() =>
                {
                    var boxMezziQuery = new BoxMezziQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };
                    info.boxMezzi = _boxMezziHandler.Handle(boxMezziQuery).BoxMezzi;
                });

                Task.Factory.StartNew(() =>
                {
                    var boxRichiesteQuery = new BoxRichiesteQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };

                    info.boxInterventi = _boxRichiesteHandler.Handle(boxRichiesteQuery).BoxRichieste;
                });

                Task.Factory.StartNew(() =>
                {
                    var boxPersonaleQuery = new BoxPersonaleQuery()
                    {
                        CodiciSede = new string[] { sede }
                    };

                    info.boxPersonale = _boxPersonaleHandler.Handle(boxPersonaleQuery).BoxPersonale;
                    var counterCodaChiamate = new CounterNotifica()
                    {
                        codDistaccamento = intervento.Richiesta.Partenze.ToList().Find(x => x.CodiceMezzo.Equals(intervento.IdMezzo)).Partenza.Mezzo.Distaccamento.Codice,
                        count = intervento.Richiesta.Partenze.ToList().Find(x => x.CodiceMezzo.Equals(intervento.IdMezzo)).Partenza.Squadre.Count
                    };

                    info.counterNotifica = counterCodaChiamate;
                });

                infoDaInviare.Add(info);
            });

            foreach (var info in infoDaInviare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyUpdateMezzoInServizio", mezzo, info.codiceSede);
                await hubConnection.InvokeAsync("ModifyAndNotifySuccessAggiornaStatoMezzo", intervento, info.codiceSede);
                await hubConnection.InvokeAsync("ChangeStateSuccess", true, info.codiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxMezzi", info.boxMezzi, info.codiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.codiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxPersonale", info.boxPersonale, info.codiceSede);

                if (intervento.StatoMezzo.Equals("InSede") || intervento.StatoMezzo.Equals("Rientrato"))
                {
                    await hubConnection.InvokeAsync("NotifyAddSquadreLibereCodaChiamate", info.counterNotifica, info.codiceSede);
                    await hubConnection.InvokeAsync("NotifyRemoveSquadreOccupateCodaChiamate", info.counterNotifica, info.codiceSede);
                }
                else
                {
                    await hubConnection.InvokeAsync("NotifyAddSquadreOccupateCodaChiamate", info.counterNotifica, info.codiceSede);
                    await hubConnection.InvokeAsync("NotifyRemoveSquadreLibereCodaChiamate", info.counterNotifica, info.codiceSede);
                }

                await hubConnection.StopAsync();
            }
        }
    }

    internal class InfoDaInviareAggiornaStatoMezzo
    {
        public string codiceSede { get; set; }
        public MezzoInServizio mezzoInServizio { get; set; }
        public AggiornaStatoMezzoCommand intervento { get; set; }
        public BoxMezzi boxMezzi { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public BoxPersonale boxPersonale { get; set; }

        public CounterNotifica counterNotifica { get; set; }
    }
}
