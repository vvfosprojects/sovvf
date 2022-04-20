using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Classi.Concorrenza;
using SO115App.Models.Servizi.CQRS.Commands.GestioneConcorrenza.AddBlock;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneConcorrenza;
using SO115App.SignalR.Utility;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneConcorrenza
{
    public class NotificationAddBlock : INotificationAddBlock
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;
        private readonly IGetSintesiRichiestaAssistenzaByCodice _getSintesiById;

        public NotificationAddBlock(IHubContext<NotificationHub> NotificationHubContext,
                                    GetGerarchiaToSend getGerarchiaToSend,
                                    IGetSintesiRichiestaAssistenzaByCodice getSintesiById)
        {
            _notificationHubContext = NotificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
            _getSintesiById = getSintesiById;
        }

        public async Task SendNotification(AddBlockCommand command)
        {
            var sintesiRichiesta = new SintesiRichiesta();
            var sediAllertate = new List<string>();
            var SediDaNotificare = new List<string>();

            if (command.concorrenza.FindAll(c => c.Type.Equals(TipoOperazione.Richiesta)).Count > 0)
            {
                sintesiRichiesta = _getSintesiById.GetSintesi(command.concorrenza.FindAll(c => c.Type.Equals(TipoOperazione.Richiesta))[0].Value);
                sediAllertate = sintesiRichiesta.CodSOAllertate.ToList();
            }

            if (sediAllertate.Count > 0)
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodComando, sediAllertate.ToArray());
            else
                SediDaNotificare = _getGerarchiaToSend.Get(command.CodComando);

            foreach (var sede in SediDaNotificare)
            {
                await _notificationHubContext.Clients.Group(sede).SendAsync("NotifyConcorrenza", command.concorrenza);
            }
        }
    }
}
