﻿using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
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
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationAddTrasferimento(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> getRichiesta,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative,
            IGetTrasferimenti getTrasferimenti,
            IGetUtenteById getUtenteById,
            IGetDistaccamentoByCodiceSede getSede)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _getRichiesta = getRichiesta;
            _getTrasferimenti = getTrasferimenti;
            _getUtenteById = getUtenteById;
            _getSede = getSede;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(AddTrasferimentoCommand command)
        {
            Log.Information("TRASFERIMENTO - Inizio elaborazione notifiche");

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

            Log.Information("TRASFERIMENTO - Recuperate tutte le informazioni da spedire");

            foreach (var sede in SediDaNotificareAdd)
            {
                Log.Information($"TRASFERIMENTO - ADD - Inizio invioa alla sede {sede}");
                //var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                //{
                //    CodiciSede = new string[] { sede }
                //}).BoxRichieste;

                Log.Information($"TRASFERIMENTO - ADD - Invio BoxInterventi alla sede {sede}");
                //await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                Log.Information($"TRASFERIMENTO - ADD - Invio richiesta alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamataTrasferita", richiesta);

                Log.Information($"TRASFERIMENTO - ADD - Invio notifica di strasferimento alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", new
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
                });

                //NOTIFICA NAVBAR
                Log.Information($"TRASFERIMENTO - ADD - Invio notifica navbar alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                {
                    Titolo = "Hai una nuova chiamata",
                    Descrizione = $"La chiamata {richiesta.Codice} è stata trasferita dal {mioComandoDes} alla tua sede",
                    Tipo = TipoNotifica.TrasferimentoChiamata,
                    Data = command.TrasferimentoChiamata.Data
                });

                var counterCodaChiamate = new CounterNotifica()
                {
                    codDistaccamento = command.TrasferimentoChiamata.CodSedeA,
                    //count = boxInterventi.Chiamate
                };

                Log.Information($"TRASFERIMENTO - ADD - Invio notifica coda chiamate alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counterCodaChiamate);
            }

            //GESTIONE SEDI DA
            var SediDaNotificareDelete = _getGerarchiaToSend.Get(command.TrasferimentoChiamata.CodSedeDa);
            foreach (var sede in SediDaNotificareDelete)
            {
                //var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                //{
                //    CodiciSede = new string[] { sede }
                //}).BoxRichieste;

                Log.Information($"TRASFERIMENTO - DELETE - Invio BoxInterventi alla sede {sede}");
                //await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                Log.Information($"TRASFERIMENTO - DELETE - Invio richiesta alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteChiamata", richiesta.Id);

                Log.Information($"TRASFERIMENTO - DELETE - Invio notifica di strasferimento alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", new
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
                });

                var counterCodaChiamate = new CounterNotifica()
                {
                    codDistaccamento = command.TrasferimentoChiamata.CodSedeA,
                    count = 1
                };

                Log.Information($"TRASFERIMENTO - DELETE - Invio notifica coda chiamate alla sede {sede}");
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counterCodaChiamate);
            }
        }
    }
}
