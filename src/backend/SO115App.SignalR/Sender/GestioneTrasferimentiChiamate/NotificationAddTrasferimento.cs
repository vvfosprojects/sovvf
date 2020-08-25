using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.Organigramma;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetSintesiRichiestaAssistenza;
using SO115App.Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.GestioneUtenti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using System.Linq;
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
        private readonly GerarchiaReader _gerarchiaReader;
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
            _gerarchiaReader = new GerarchiaReader(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(AddTrasferimentoCommand command)
        {
            var mioComandoDes = _getSede.Get(command.CodiceSede).Descrizione;
            var mioOperatore = _getUtenteById.GetUtenteByCodice(command.TrasferimentoChiamata.IdOperatore);
            var totalItemsA = _getTrasferimenti.Count(command.TrasferimentoChiamata.CodSedeA);
            var totalItemsDa = _getTrasferimenti.Count(new string[] { command.TrasferimentoChiamata.CodSedeDa });
            var richiesta = _getRichiesta.Handle(new GetSintesiRichiestaAssistenzaQuery()
            {
                CodiceRichiesta = command.TrasferimentoChiamata.CodRichiesta,
                CodiceSede = command.TrasferimentoChiamata.CodSedeA[0]
            }).SintesiRichiesta;

            //GESTIONE SEDI A
            var SediDaNotificareAdd = _gerarchiaReader.GetGerarchia(command.TrasferimentoChiamata.CodSedeA)
                .Select(c => c.Codice)
                .ToList();
            foreach (var sede in SediDaNotificareAdd)
            {
                var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", richiesta);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", new
                {
                    Data = new TrasferimentoChiamataFull()
                    {
                        Id = command.TrasferimentoChiamata.Id,
                        CodRichiesta = command.TrasferimentoChiamata.CodRichiesta,
                        Data = command.TrasferimentoChiamata.Data,
                        SedeA = command.TrasferimentoChiamata.CodSedeA.Select(c => _getSede.Get(c).Descrizione).ToArray(),
                        SedeDa = mioComandoDes,
                        Operatore = mioOperatore
                    },
                    Pagination = new Paginazione()
                    {
                        TotalItems = totalItemsA
                    }
                });

                //NOTIFICA NAVBAR
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new
                {
                    Titolo = "Hai una nuova chiamata",
                    Descrizione = $"La chiamata {richiesta.Codice} è stata trasferita dal {mioComandoDes} alla tua sede",
                    Tipo = TipoNotifica.TrasferimentoChiamata
                });
            }

            //GESTIONE SEDI DA
            var SediDaNotificareDelete = _gerarchiaReader.GetGerarchia(command.TrasferimentoChiamata.CodSedeDa)
                .Select(c => c.Codice)
                .ToList();
            foreach (var sede in SediDaNotificareDelete)
            {
                var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteChiamata", richiesta.Id);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", new
                {
                    Data = new TrasferimentoChiamataFull()
                    {
                        Id = command.TrasferimentoChiamata.Id,
                        CodRichiesta = command.TrasferimentoChiamata.CodRichiesta,
                        Data = command.TrasferimentoChiamata.Data,
                        SedeA = command.TrasferimentoChiamata.CodSedeA.Select(c => _getSede.Get(c).Descrizione).ToArray(),
                        SedeDa = mioComandoDes,
                        Operatore = mioOperatore
                    },
                    Pagination = new Paginazione()
                    {
                        TotalItems = totalItemsDa
                    }
                });
            }
        }
    }
}
