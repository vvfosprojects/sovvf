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
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Condivise;
using SO115App.API.Models.Classi.Soccorso;
using SO115App.API.Models.Classi.Soccorso.StatiRichiesta;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationConfermaPartenze : INotificationConfermaPartenze
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _BoxRichiestehandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _BoxMezzihandler;



        public NotificationConfermaPartenze(IHubContext<NotificationHub> NotificationHubContext, IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> BoxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> BoxMezzihandler)
        {
            _notificationHubContext = NotificationHubContext;
            _BoxRichiestehandler = BoxRichiestehandler;
            _BoxMezzihandler = BoxMezzihandler;


        }

        public async Task SendNotification(ConfermaPartenzeCommand conferma)
        {
            SintesiRichieste sintesi = new SintesiRichieste();
            RichiestaAssistenza richiesta = conferma.ConfermaPartenze.richiesta;
            List<Partenza> partenze = new List<Partenza>();
            Partenza partenza = new Partenza();

            var eventi = richiesta.Partenze;

            foreach ( var evento in eventi )
            {
                partenza = new Partenza
                {
                    Mezzo = evento.Partenza.Mezzo,
                    Squadre = evento.Partenza.Squadre
                };
                partenze.Add(partenza);
            }
            sintesi.CodiceRichiesta = richiesta.Codice;
            sintesi.Id = richiesta.Id;
            sintesi.Operatore = new Utente(richiesta.Operatore.Username, richiesta.Operatore.Nome, richiesta.Operatore.Cognome, richiesta.Operatore.CodiceFiscale);
            sintesi.Tipologie = richiesta.Tipologie;
            sintesi.ZoneEmergenza = richiesta.ZoneEmergenza;
            sintesi.Localita = richiesta.Localita;
            sintesi.Aperta = richiesta.Aperta;
            sintesi.Chiusa = richiesta.Chiusa;
            sintesi.Codice = richiesta.Codice;
            sintesi.CodiceSchedaNue = richiesta.CodiceSchedaNue;
            sintesi.Competenze = richiesta.Competenze;
            sintesi.Descrizione = richiesta.Descrizione;
            sintesi.IstantePresaInCarico = richiesta.IstantePresaInCarico;
            sintesi.IstantePrimaAssegnazione = richiesta.IstantePrimaAssegnazione;
            sintesi.Presidiato = richiesta.Presidiato;
            sintesi.PrioritaRichiesta = richiesta.PrioritaRichiesta;
            sintesi.Richiedente = richiesta.Richiedente;
            sintesi.Sospesa = richiesta.Sospesa;
            sintesi.Partenze = partenze;
            sintesi.Stato = DecodifcaStatoRichiesta(richiesta.StatoRichiesta);
            conferma.ConfermaPartenze.Chiamata = sintesi;

            var BoxRichiestequery = new BoxRichiesteQuery();
            var BoxMezziquery = new BoxMezziQuery();
            BoxInterventi boxInterventi = new BoxInterventi();
            BoxMezzi boxMezzi = new BoxMezzi();
            boxInterventi = (BoxInterventi)this._BoxRichiestehandler.Handle(BoxRichiestequery).BoxRichieste;
            boxMezzi = (BoxMezzi)this._BoxMezzihandler.Handle(BoxMezziquery).BoxMezzi;


            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("ModifyAndNotifySuccess", conferma.ConfermaPartenze);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
            await _notificationHubContext.Clients.Group(conferma.ConfermaPartenze.CodiceSede).SendAsync("NotifyGetBoxMezzi", boxMezzi);


        }

        private string DecodifcaStatoRichiesta(IStatoRichiesta statoRichiesta)
        {
            switch (statoRichiesta.ToString())
            {
                case "SO115App.API.Models.Classi.Soccorso.StatiRichiesta.InAttesa":
                    return "Chiamata";

                case "SO115App.API.Models.Classi.Soccorso.StatiRichiesta.Assegnata":
                    return "Assegnata";

                case "SO115App.API.Models.Classi.Soccorso.StatiRichiesta.Chiusa":
                    return "Chiusa";

                case "SO115App.API.Models.Classi.Soccorso.StatiRichiesta.Sospesa":
                    return "Sospesa";

                default:
                    return "Chiusa";
            }
        }
    }
}
