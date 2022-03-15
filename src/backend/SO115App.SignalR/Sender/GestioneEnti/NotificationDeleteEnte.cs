using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.DeleteEnte;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationDeleteEnte : INotificationDeleteEnte
    {
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetRubrica _getRubrica;
        private readonly IConfiguration _config;

        public NotificationDeleteEnte(GetGerarchiaToSend getGerarchiaToSend,
                                      IGetRubrica getRubrica, IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getRubrica = getRubrica;
            _config = config;
        }

        public async Task SendNotification(DeleteEnteCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = new List<string>();

            if (command.Ricorsivo)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede[0]);
            else
                SediDaNotificare.Add(command.CodiceSede[0]);

            var count = _getRubrica.CountBylstCodiciSede(SediDaNotificare.ToArray());
            var lstEnti = _getRubrica.Get(command.CodiceSede, null);

            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyDeleteEnte", new
                {
                    Data = command.Id,
                    Pagination = new Paginazione() { TotalItems = count }
                }, sede);
                await hubConnection.InvokeAsync("NotifyChangeEnti", lstEnti, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
