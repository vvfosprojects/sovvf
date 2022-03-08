using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.AnnullaRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.SignalR.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationAnnullaRichiestaSoccorsoAereo : INotificationAnnullaRichiestaSoccorsoAereo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IGetBoxRichieste _getBoxRichieste;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly IConfiguration _config;

        public NotificationAnnullaRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext,
                                                         IGetBoxRichieste getBoxRichieste,
                                                         GetGerarchiaToSend getGerarchiaToSend,
                                                         IMapperRichiestaSuSintesi mapperSintesi,
                                                         IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getBoxRichieste = getBoxRichieste;
            _notificationHubContext = notificationHubContext;
            _mapperSintesi = mapperSintesi;
            _config = config;
        }

        public async Task SendNotification(AnnullaRichiestaSoccorsoAereoCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            //Sedi gerarchicamente superiori alla richiesta che dovanno ricevere la notifica
            var SediDaNotificare = new List<string>();
            if (command.Richiesta.CodSOAllertate != null)
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente, command.Richiesta.CodSOAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.Richiesta.CodSOCompetente);

            try
            {
                var listaInfoDaSperide = new List<InfoDaSpedire>();
                Parallel.ForEach(SediDaNotificare, sede =>
                {
                    var info = new InfoDaSpedire();

                    if (!command.ResponseAFM.IsError())
                    {
                        var sintesi = _mapperSintesi.Map(command.Richiesta);

                        info.Sintesi = sintesi;
                        //_notificationHubContext.Clients.Group(sede).SendAsync("NotifySuccessAnnullamentoAFM", sintesi);

                        //_notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", new { chiamata = sintesi });

                        Task.Factory.StartNew(() =>
                        {
                            var boxRichieste = _getBoxRichieste.Get(command.CodiciSede.Select(p => new API.Models.Classi.Organigramma.PinNodo(p, true)).ToHashSet());
                            info.boxInterventi = boxRichieste;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxRichieste);
                        });
                    }
                    else
                        info.noteAnnullamento = ((AnnullamentoRichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note;
                    //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyErrorAFM", ((AnnullamentoRichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note);

                    listaInfoDaSperide.Add(info);
                });

                foreach (var info in listaInfoDaSperide)
                {
                    await hubConnection.StartAsync();
                    await hubConnection.InvokeAsync("NotifySuccessAnnullamentoAFM", info.Sintesi, info.sede);
                    await hubConnection.InvokeAsync("ModifyAndNotifySuccess", info.Sintesi, info.sede);
                    await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.sede);
                    await hubConnection.InvokeAsync("NotifyAddChiamateCodaChiamate", info.noteAnnullamento, info.sede);
                    await hubConnection.StopAsync();
                };
            }
            catch (Exception ex)
            {
                await hubConnection.StopAsync();
            }
        }
    }

    public class InfoDaSpedire
    {
        public SintesiRichiesta Sintesi { get; set; }
        public string sede { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public string noteAnnullamento { get; set; }
    }
}
