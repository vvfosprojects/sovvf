using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.UpdateEnte;
using SO115App.Models.Servizi.CQRS.Queries.GestioneRubrica;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationUpdateEnte : INotificationUpdateEnte
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetRubrica _getRurbica;

        public NotificationUpdateEnte(IGetRubrica getRurbica,
            IHubContext<NotificationHub> notificationHubContext, GetGerarchiaToSend getGerarchiaToSend)
        {
            _getRurbica = getRurbica;
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(UpdateEnteCommand command)
        {
            var SediDaNotificare = new List<string>();

            if (command.Ente.Ricorsivo)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede[0]);
            else
                SediDaNotificare.Add(command.CodiceSede[0]);


            var count = _getRurbica.CountBylstCodiciSede(SediDaNotificare.ToArray());
            var lstEnti = _getRurbica.Get(command.CodiceSede, null);
            var Ente = lstEnti.Find(c => c.Telefoni == command.Ente.Telefoni && c.Descrizione == command.Ente.Descrizione);

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyUpdateEnte", new
                {
                    Pagination = new Paginazione() { TotalItems = count },
                    Data = Ente
                });

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyChangeEnti", lstEnti);
            }
        }
    }
}
