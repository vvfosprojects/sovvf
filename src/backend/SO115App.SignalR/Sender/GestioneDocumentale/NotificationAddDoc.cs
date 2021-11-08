using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneDocumentale.InsertDoc;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDocumentale;
using SO115App.SignalR.Utility;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneDocumentale
{
    public class NotificationAddDoc : INotificationAddDoc
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAddDoc(IHubContext<NotificationHub> notificationHubContext,
                                               GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public async Task SendNotification(AddDocCommand command)
        {
            var SediDaNotificare = _getGerarchiaToSend.Get(command.Documento.CodSede);

            await Task.Factory.StartNew(() => Parallel.ForEach(SediDaNotificare, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddDoc", $"E' stata inserito il nuovo documento {command.Documento.DescrizioneDocumento} ");
            }));
        }
    }
}
