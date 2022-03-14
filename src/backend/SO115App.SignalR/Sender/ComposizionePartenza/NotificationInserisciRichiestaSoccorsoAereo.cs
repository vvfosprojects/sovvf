using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.Soccorso.Eventi;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.InserisciRichiestaSoccorsoAereo;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.ComposizionePartenza
{
    public class NotificationInserisciRichiestaSoccorsoAereo : INotificationInserisciRichiestaSoccorsoAereo
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IMapperRichiestaSuSintesi _mapperSintesi;
        private readonly IConfiguration _config;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        private readonly IGetBoxRichieste _getBoxRichieste;

        public NotificationInserisciRichiestaSoccorsoAereo(IHubContext<NotificationHub> notificationHubContext,
                                                           IGetBoxRichieste getBoxRichieste, GetGerarchiaToSend getGerarchiaToSend,
                                                           IMapperRichiestaSuSintesi mapperSintesi, IConfiguration config)
        {
            _getGerarchiaToSend = getGerarchiaToSend;
            _getBoxRichieste = getBoxRichieste;
            _notificationHubContext = notificationHubContext;
            _mapperSintesi = mapperSintesi;
            _config = config;
        }

        public async Task SendNotification(InserisciRichiestaSoccorsoAereoCommand command)
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
                var listaInfoDaSperide = new List<InfoDaSpedireAFM>();
                Parallel.ForEach(SediDaNotificare, sede =>
                {
                    var info = new InfoDaSpedireAFM();

                    info.codSede = sede;
                    if (!command.ResponseAFM.IsError()) //SUCCESSO
                    {
                        var sintesi = _mapperSintesi.Map(command.Richiesta);

                        info.sintesi = sintesi;
                        info.chiamata = sintesi;

                        //_notificationHubContext.Clients.Group(sede).SendAsync("NotifySuccessAFM", sintesi);

                        //_notificationHubContext.Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", new { chiamata = sintesi });

                        Task.Factory.StartNew(() =>
                        {
                            var boxRichieste = _getBoxRichieste.Get(command.CodiciSede.Select(p => new API.Models.Classi.Organigramma.PinNodo(p, true)).ToHashSet());

                            info.boxInterventi = boxRichieste;
                            //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxRichieste);
                        });
                    }
                    else //FALLIMENTO
                        //_notificationHubContext.Clients.Group(sede).SendAsync("NotifyErrorAFM", ((RichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note);
                        info.NoteErrore = ((RichiestaSoccorsoAereo)command.Richiesta.ListaEventi.LastOrDefault()).Note;

                    listaInfoDaSperide.Add(info);
                });

                foreach (var info in listaInfoDaSperide)
                {
                    await hubConnection.StartAsync();
                    await hubConnection.InvokeAsync("NotifySuccessAFM", info.sintesi);
                    await hubConnection.InvokeAsync("ModifyAndNotifySuccess", info.chiamata);
                    await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.boxInterventi, info.codSede);

                    if (command.ResponseAFM.IsError())
                        await hubConnection.InvokeAsync("NotifyErrorAFM", info.NoteErrore, info.codSede);

                    await hubConnection.StopAsync();
                }
            }
            catch
            {
                await hubConnection.StopAsync();
            }
        }
    }

    internal class InfoDaSpedireAFM
    {
        public string codSede { get; set; }
        public SintesiRichiesta sintesi { get; set; }
        public SintesiRichiesta chiamata { get; set; }
        public BoxInterventi boxInterventi { get; set; }
        public string NoteErrore { get; set; }
    }
}
