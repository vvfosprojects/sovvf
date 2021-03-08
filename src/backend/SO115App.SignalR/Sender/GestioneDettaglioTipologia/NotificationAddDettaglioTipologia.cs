﻿using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDettaglioTipologie.InserimentoDettaglioTipologia;
using SO115App.Models.Servizi.CQRS.Queries.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneDettaglioTipologia
{
    public class NotificationAddDettaglioTipologia : INotificationAddDettaglioTipologia
    {
        private GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetListaDettaglioTipologia _getDettaglioTipologia;
        private IHubContext<NotificationHub> _notificationHubContext;

        public NotificationAddDettaglioTipologia(IHubContext<NotificationHub> NotificationHubContext,
            GetGerarchiaToSend getGerarchiaToSend,
            IGetListaDettaglioTipologia getDettaglioTipologia)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getDettaglioTipologia = getDettaglioTipologia;
            _notificationHubContext = NotificationHubContext;
        }

        public async Task SendNotification(AddDettaglioTipologiaCommand dettaglioTipologia)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(dettaglioTipologia.CodiceSede[0]);

            DettaglioTipologiaQuery query = new DettaglioTipologiaQuery()
            {
                IdSede = dettaglioTipologia.CodiceSede,
                Filters = new Models.Classi.Filtri.FiltriDettaglioTipologia() { Search = "" },
            };

            var listaDettagliTipologia = _getDettaglioTipologia.Get(query);

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddDettaglioTipologia", new
                {
                    Pagination = new Paginazione() { TotalItems = listaDettagliTipologia.Count }
                });

                //await _notificationHubContext.Clients.Group(sede).SendAsync("ElencoDettaglioTipologia", listaDettagliTipologia);
            }
        }
    }
}
