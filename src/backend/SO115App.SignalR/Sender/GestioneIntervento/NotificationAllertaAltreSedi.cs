using DomainModel.CQRS.Commands.AllertaAltreSedi;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.Infrastruttura.Notification.AllertaAltreSedi;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneIntervento
{
    public class NotificationAllertaAltreSedi : INotificationAllertaAltreSedi
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IConfiguration _config;

        public NotificationAllertaAltreSedi(IHubContext<NotificationHub> notificationHubContext,
                                            IGetSintesiRichiestaAssistenzaByCodice getSintesiById,
                                            GetGerarchiaToSend getGerarchiaToSend, IConfiguration config
                                            )
        {
            _notificationHubContext = notificationHubContext;
            _getSintesiById = getSintesiById;
            _getGerarchiaToSend = getGerarchiaToSend;
            _config = config;
        }

        public async Task SendNotification(AllertaAltreSediCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var sintesi = _getSintesiById.GetSintesi(command.CodiceRichiesta);

            var SediDaNotificare = new List<string>();
            if (sintesi.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente, sintesi.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(sintesi.CodSOCompetente);

            command.Chiamata = sintesi;
            //Invio la notifica alle competenze della richiesta
            foreach (var sede in SediDaNotificare)
            {
                await hubConnection.StartAsync();
                await hubConnection.InvokeAsync("ModifyAndNotifySuccessAllerta", command, sede);

                if (!sede.Equals(sintesi.CodSOCompetente))
                    await hubConnection.InvokeAsync("NotifyAllertaAltreSedi", sintesi, sede);

                await _notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", command);

                #region Notifica Navbar

                if (sede.Equals(command.CodiceSede))
                {
                    if (command.CodSediAllertate.Count() > 1)
                    {
                        await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                        {
                            Titolo = "Allerta Emergenza",
                            Descrizione = $"Sono state allertate le sedi: {String.Join(',', command.CodSediAllertate)}",
                            Tipo = TipoNotifica.AllertaEmergenza,
                            Data = DateTime.Now
                        });
                    }
                    else
                    {
                        await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                        {
                            Titolo = "Allerta Emergenza",
                            Descrizione = $"E' stata allertata la sede: {command.CodSediAllertate[0]}",
                            Tipo = TipoNotifica.AllertaEmergenza,
                            Data = DateTime.Now
                        });
                    }
                }
                else
                {
                    var codiceSintesi = sintesi.CodiceRichiesta != null ? sintesi.CodiceRichiesta : sintesi.Codice;
                    await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                    {
                        Titolo = "Allerta Emergenza",
                        Descrizione = $"La sede {command.CodiceSede} ha allertato {String.Join(',',command.CodSediAllertate)} per l'intervento {codiceSintesi}",
                        Tipo = TipoNotifica.AllertaEmergenza,
                        Data = DateTime.Now
                    });                    
                }

                #endregion Notifica Navbar
            }

            if (command.CodSediAllertateOld != null)
            {
                foreach (var sede in command.CodSediAllertateOld)
                {
                    await hubConnection.StartAsync();
                    await hubConnection.InvokeAsync("NotifyDeleteAllertaAltreSedi", command.CodiceRichiesta, sede);
                    await hubConnection.StopAsync();
                }
            }
        }
    }
}
