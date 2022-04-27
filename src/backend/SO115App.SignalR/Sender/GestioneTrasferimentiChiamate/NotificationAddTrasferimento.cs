using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Client;
using Microsoft.Extensions.Configuration;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetSintesiRichiestaAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTrasferimentiChiamate
{
    public class NotificationAddTrasferimento : INotificationAddTrasferimento
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> _getRichiesta;
        private readonly IGetTrasferimenti _getTrasferimenti;
        private readonly IGetUtenteById _getUtenteById;
        private readonly IGetDistaccamentoByCodiceSede _getSede;
        private readonly IConfiguration _config;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAddTrasferimento(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> getRichiesta,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetTrasferimenti getTrasferimenti,
            IGetUtenteById getUtenteById,
            IGetDistaccamentoByCodiceSede getSede,
            IConfiguration config)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _getRichiesta = getRichiesta;
            _getTrasferimenti = getTrasferimenti;
            _getUtenteById = getUtenteById;
            _getSede = getSede;
            _config = config;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(AddTrasferimentoCommand command)
        {
            #region connessione al WSSignalR

            var hubConnection = new HubConnectionBuilder()
                        .WithUrl(_config.GetSection("UrlExternalApi").GetSection("WSSignalR").Value)
                        .Build();

            #endregion connessione al WSSignalR

            var mioComandoDes = _getSede.GetSede(command.CodiciSede[0]).Descrizione;
            var mioOperatore = _getUtenteById.GetUtenteByCodice(command.TrasferimentoChiamata.IdOperatore);
            var totalItemsA = _getTrasferimenti.Count(command.TrasferimentoChiamata.CodSedeA);
            var totalItemsDa = _getTrasferimenti.Count(command.TrasferimentoChiamata.CodSedeDa);
            var richiesta = _getRichiesta.Handle(new GetSintesiRichiestaAssistenzaQuery()
            {
                CodiceRichiesta = command.TrasferimentoChiamata.CodChiamata,
                CodiceSede = command.TrasferimentoChiamata.CodSedeA
            }).SintesiRichiesta;

            //GESTIONE SEDI A
            var SediDaNotificareAdd = _getGerarchiaToSend.Get(command.TrasferimentoChiamata.CodSedeA);

            var listaInfotrasferimento = new List<InfoDaInviareTrasferimento>();

            Parallel.ForEach(SediDaNotificareAdd, sede =>
            {
                var info = new InfoDaInviareTrasferimento();

                info.CodiceSede = sede;
                info.IsSedeA = true;
                info.BoxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                info.CounterNotifica = new CounterNotifica()
                {
                    codDistaccamento = command.TrasferimentoChiamata.CodSedeA,
                    count = info.BoxInterventi.Chiamate
                };

                info.AddTrasferiento = new
                {
                    Data = new TrasferimentoChiamataFull()
                    {
                        Id = command.TrasferimentoChiamata.Id,
                        CodChiamata = command.TrasferimentoChiamata.CodChiamata,
                        Data = command.TrasferimentoChiamata.Data,
                        SedeA = _getSede.GetSede(command.TrasferimentoChiamata.CodSedeA).Descrizione,
                        SedeDa = mioComandoDes,
                        Operatore = mioOperatore
                    },
                    Pagination = new Paginazione()
                    {
                        TotalItems = totalItemsA
                    }
                };

                info.Notifica = new Notifica()
                {
                    Titolo = "Hai una nuova chiamata",
                    Descrizione = $"La chiamata {richiesta.Codice} è stata trasferita dal {mioComandoDes} alla tua sede",
                    Tipo = TipoNotifica.TrasferimentoChiamata,
                    Data = command.TrasferimentoChiamata.Data
                };

                listaInfotrasferimento.Add(info);
            });

            //GESTIONE SEDI DA
            var SediDaNotificareDelete = _getGerarchiaToSend.Get(command.TrasferimentoChiamata.CodSedeDa);
            Parallel.ForEach(SediDaNotificareDelete, sede =>
            {
                var info = new InfoDaInviareTrasferimento();
                info.CodiceSede = sede;
                info.IsSedeA = false;
                info.BoxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                info.AddTrasferiento = new
                {
                    Data = new TrasferimentoChiamataFull()
                    {
                        Id = command.TrasferimentoChiamata.Id,
                        CodChiamata = command.TrasferimentoChiamata.CodChiamata,
                        Data = command.TrasferimentoChiamata.Data,
                        SedeA = _getSede.GetSede(command.TrasferimentoChiamata.CodSedeA).Descrizione,
                        SedeDa = mioComandoDes,
                        Operatore = mioOperatore
                    },
                    Pagination = new Paginazione()
                    {
                        TotalItems = totalItemsDa
                    }
                };

                info.CounterNotifica = new CounterNotifica()
                {
                    codDistaccamento = command.TrasferimentoChiamata.CodSedeA,
                    count = 1
                };

                listaInfotrasferimento.Add(info);
            });

            foreach (var info in listaInfotrasferimento)
            {
                await hubConnection.StartAsync();

                if (info.IsSedeA)
                    await hubConnection.InvokeAsync("SaveAndNotifySuccessChiamataTrasferita", richiesta, info.CodiceSede);
                else
                    await hubConnection.InvokeAsync("NotifyDeleteChiamata", richiesta.Id, info.CodiceSede);

                await hubConnection.InvokeAsync("NotifyAddTrasferimento", info.AddTrasferiento, info.CodiceSede);
                await hubConnection.InvokeAsync("NotifyGetBoxInterventi", info.BoxInterventi, info.CodiceSede);
                await hubConnection.InvokeAsync("NotifyNavBar", info.Notifica, info.CodiceSede);
                await hubConnection.InvokeAsync("NotifyAddChiamateCodaChiamate", info.CounterNotifica, info.CodiceSede);

                await hubConnection.StopAsync();
            };
        }
    }

    internal class InfoDaInviareTrasferimento
    {
        public string CodiceSede { get; set; }
        public BoxInterventi BoxInterventi { get; set; }
        public bool IsSedeA { get; set; }
        public object AddTrasferiento { get; set; }
        public Notifica Notifica { get; set; }
        public CounterNotifica CounterNotifica { get; set; }
    }
}
