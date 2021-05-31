using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.InsertPos;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePos
{
    public class NotificationAddPos : INotificationAddPos
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAddPos(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(AddPosCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.Pos.CodSede);

            await Task.Factory.StartNew(() => Parallel.ForEach(SediDaNotificare, sede =>
            {
                foreach (var tipologia in command.Pos.listaTipologie)
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddPos", $"E' stata inserita la pos {command.Pos.DescrizionePos} per la tipologia {tipologia.CodTipologia}");
                }
            }));
        }
    }
}
