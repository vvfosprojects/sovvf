using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestionePOS.EditPos;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestionePos
{
    public class NotificationEditPos : INotificationEditPos
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationEditPos(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(EditPosCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.Pos.CodSede);

            await Task.Factory.StartNew(() => Parallel.ForEach(SediDaNotificare, sede =>
            {
                foreach (var tipologia in command.Pos.ListaTipologie)
                {
                    _notificationHubContext.Clients.Group(sede).SendAsync("NotifyEditPos", $"E' stata inserita la pos {command.Pos.DescrizionePos} ");
                }
            }));
        }
    }
}
