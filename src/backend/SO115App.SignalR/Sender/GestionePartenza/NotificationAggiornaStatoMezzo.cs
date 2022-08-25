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
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePartenza.AggiornaStatoMezzo;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.SignalR.Sender.AggiornamentoBox;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePartenza
{
    public class NotificationAggiornaStatoMezzo : INotifyAggiornaStatoMezzo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetMezziInServizio _getListaMezzi;
        private readonly NotificationAggiornaBox _notificationAggiornaBox;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly GetSediPartenze _getSediPartenze;

        public NotificationAggiornaStatoMezzo(IHubContext<NotificationHub> notificationHubContext,
                                          GetGerarchiaToSend getGerarchiaToSend,
                                          GetSediPartenze getSediPartenze,
                                          IGetMezziInServizio getListaMezzi, NotificationAggiornaBox notificationAggiornaBox)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSediPartenze = getSediPartenze;
            _getListaMezzi = getListaMezzi;
            _notificationAggiornaBox = notificationAggiornaBox;
        }

        public async Task SendNotification(AggiornaStatoMezzoCommand intervento)
        {
            var SediDaNotificare = intervento.CodiciSede.ToList();
            if (intervento.Richiesta.CodSOAllertate != null)
                SediDaNotificare.AddRange(_getGerarchiaToSend.Get(intervento.Richiesta.CodSOCompetente, intervento.Richiesta.CodSOAllertate.ToArray()));
            else
                SediDaNotificare.AddRange(_getGerarchiaToSend.Get(intervento.Richiesta.CodSOCompetente));

            SediDaNotificare.AddRange(_getSediPartenze.GetFromRichiesta(intervento.Richiesta));
            //SediDaNotificare.Add("00"); //AGGIUNGO IL CON ALLA NOTFICA

            var listaMezziInServizio = _getListaMezzi.MapPartenzeInMezziInServizio(intervento.Richiesta, SediDaNotificare.ToArray());

            var mezzo = listaMezziInServizio.Find(x => x.Mezzo.Mezzo.Codice.Equals(intervento.IdMezzo));

            Parallel.ForEach(SediDaNotificare.Distinct(), sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", mezzo);
                _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", intervento);
                _notificationHubContext.Clients.Group(sede).SendAsync("ChangeStateSuccess", true);

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

            _notificationAggiornaBox.SendNotification(SediDaNotificare);
        }
    }
}
