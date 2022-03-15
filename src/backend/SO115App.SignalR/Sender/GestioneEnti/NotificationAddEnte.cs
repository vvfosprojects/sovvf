using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneRubrica.Enti.AddEnte;
using SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEnti
{
    public class NotificationAddEnte : INotificationAddEnte
    {
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;
        private readonly IGetRubrica _getRurbica;

        public NotificationAddEnte(IGetRubrica getRurbica,
                                   GetGerarchiaToSend getGerarchiaToSend,
                                   IConfiguration config)
        {
            _getRurbica = getRurbica;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(AddEnteCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var SediDaNotificare = new List<string>();

            if (command.Ente.Ricorsivo)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodiceSede[0]);
            else
                SediDaNotificare.Add(command.CodiceSede[0]);

            var count = _getRurbica.CountBylstCodiciSede(SediDaNotificare.ToArray());
            var lstEnti = _getRurbica.Get(command.CodiceSede, null);

            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("NotifyAddEnte", new
                {
                    Pagination = new Paginazione() { TotalItems = count }
                }, sede);
                await hubConnection.InvokeAsync("NotifyChangeEnti", lstEnti, sede);
                await hubConnection.StopAsync();
            }
        }
    }
}
