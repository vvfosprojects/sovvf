using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.RichiestaCreazioneCRA;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using SO115App.SignalR.Utility;
using System;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationRichiestaCraEmergenza : INotifyRichiestaCraEmergenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly GetGerarchiaToSend _getGerarchiaToSend;

        public NotificationRichiestaCraEmergenza(IHubContext<NotificationHub> notificationHubContext, GetGerarchiaToSend getGerarchiaToSend)
        {
            _notificationHubContext = notificationHubContext;
            _getGerarchiaToSend = getGerarchiaToSend;
        }

        public void Send(RichiestaCreazioneCRACommand richiesta)
        {
            var ListaSediDestinatarie = _getGerarchiaToSend.Get(richiesta.CodSede);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyModificaEmergenza", richiesta.InfoEmergenza);

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyNavBar", new Notifica()
            {
                Titolo = "Richiesta Emergenza",
                Descrizione = $"E' stata inviata una richiesta di autorizzazione per la creazione di un Cra per l'emergenza {richiesta.InfoEmergenza.CodEmergenza} da parte del comando {richiesta.InfoEmergenza.CodComandoRichiedente}",
                Tipo = TipoNotifica.UpDateEmergenza,
                Data = DateTime.Now
            });

            Parallel.ForEach(ListaSediDestinatarie, sede =>
            {
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyModificaEmergenza", richiesta.InfoEmergenza);

                //NOTIFICA NAVBAR
                _notificationHubContext.Clients.Group(sede).SendAsync("NotifyNavBar", new Notifica()
                {
                    Titolo = "Richiesta Emergenza",
                    Descrizione = $"E' stata inviata una richiesta per l'emergenza {richiesta.InfoEmergenza.CodEmergenza} da parte del comando {richiesta.CodSede}",
                    Tipo = TipoNotifica.UpDateEmergenza,
                    Data = DateTime.Now
                });
            });
        }
    }
}
