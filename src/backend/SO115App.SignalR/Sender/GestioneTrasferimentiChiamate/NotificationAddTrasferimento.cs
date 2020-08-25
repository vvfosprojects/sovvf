using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneTrasferimentiChiamate.AddTrasferimento;
using SO115App.Models.Servizi.CQRS.Queries.GestioneSoccorso.GetSintesiRichiestaAssistenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.SignalR.Utility;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneTrasferimentiChiamate
{
    public class NotificationAddTrasferimento : INotificationAddTrasferimento
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiesteHandler;
        private readonly IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> _getRichiesta;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        public NotificationAddTrasferimento(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiesteHandler,
            IQueryHandler<GetSintesiRichiestaAssistenzaQuery, GetSintesiRichiestaAssistenzaResult> getRichiesta,
            IGetAlberaturaUnitaOperative getAlberaturaUnitaOperative)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiesteHandler = boxRichiesteHandler;
            _getRichiesta = getRichiesta;
            _getGerarchiaToSend = new GetGerarchiaToSend(getAlberaturaUnitaOperative);
        }

        public async Task SendNotification(AddTrasferimentoCommand command)
        {
            var richiesta = _getRichiesta.Handle(new GetSintesiRichiestaAssistenzaQuery()
            {
                CodiceRichiesta = command.TrasferimentoChiamata.CodRichiesta,
                CodiceSede = command.TrasferimentoChiamata.CodSedeA
            }).SintesiRichiesta;

            //GESTIONE SEDI CON ADD RICHIESTA
            var SediDaNotificareAdd = _getGerarchiaToSend.Get(command.TrasferimentoChiamata.CodSedeA);
            foreach (var sede in SediDaNotificareAdd.Where(c => c.Contains(".")).ToList())
            {
                var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", richiesta);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", command.TrasferimentoChiamata);

                //NOTIFICA NAVBAR
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new
                {
                    Titolo = "Hai una nuova chiamata",
                    Descrizione = $"La chiamata {richiesta.Codice} è stata trasferita dal comando {command.CodiceSede} alla tua sede",
                    Tipo = TipoNotifica.TrasferimentoChiamata
                });
            }

            //GESTIONE SEDI CON DELETE RICHIESTA
            var SediDaNotificareDelete = _getGerarchiaToSend.Get(command.TrasferimentoChiamata.CodSedeDa);
            foreach (var sede in SediDaNotificareDelete.Where(c => c.Contains(".")).ToList())
            {
                var boxInterventi = _boxRichiesteHandler.Handle(new BoxRichiesteQuery()
                {
                    CodiciSede = new string[] { sede }
                }).BoxRichieste;

                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyDeleteChiamata", richiesta.Id);
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyAddTrasferimento", command.TrasferimentoChiamata);
            }
        }
    }
}
