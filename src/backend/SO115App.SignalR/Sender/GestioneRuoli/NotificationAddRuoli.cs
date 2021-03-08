﻿using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneUtenti.AddRuoliUtente;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneRuoli
{
    public class NotificationAddRuoli : INotifyAddRuoli
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetUtenteByCF _getUtenteByCF;

        public NotificationAddRuoli(IHubContext<NotificationHub> notificationHubContext, IGetUtenteByCF getUtenteByCF)
        {
            _notificationHubContext = notificationHubContext;
            _getUtenteByCF = getUtenteByCF;
        }

        public async Task Notify(AddRuoliUtenteCommand command)
        {
            var utente = _getUtenteByCF.Get(command.CodFiscale);
            //await _notificationHubContext.Clients.Group(utente.Sede.Codice).SendAsync("NotifyRefreshUtenti", utente.Id).ConfigureAwait(false);
            await _notificationHubContext.Clients.All.SendAsync("NotifyModificatoRuoloUtente", utente.Id).ConfigureAwait(false);
        }
    }
}
