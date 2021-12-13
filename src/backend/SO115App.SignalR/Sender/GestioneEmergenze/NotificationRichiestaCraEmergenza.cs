using Microsoft.AspNetCore.SignalR;
using SO115App.Models.Classi.Emergenza;
using SO115App.Models.Classi.NotificheNavbar;
using SO115App.Models.Servizi.CQRS.Commands.GestioneEmergenza.RichiestaCreazioneCRA;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEmergenza;
using System;

namespace SO115App.SignalR.Sender.GestioneEmergenze
{
    public class NotificationRichiestaCraEmergenza : INotifyRichiestaCraEmergenza
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;

        public NotificationRichiestaCraEmergenza(IHubContext<NotificationHub> notificationHubContext)
        {
            _notificationHubContext = notificationHubContext;
        }

        public void Send(RichiestaCreazioneCRACommand richiesta)
        {
            _notificationHubContext.Clients.Group("00").SendAsync("NotifyEmergenzaRichiestaCra", new NotifyRichiestaCra()
            {
                CodComando = richiesta.CodSede,
                Dirigenti = richiesta.Dirigenti,
                Emergenza = richiesta.InfoEmergenza,
                NumDoa = richiesta.NumeroDOA
            });

            _notificationHubContext.Clients.Group("00").SendAsync("NotifyNavBar", new Notifica()
            {
                Titolo = "Richiesta Emergenza",
                Descrizione = $"E' stata inviata una richiesta di autorizzazione per la creazione di un Cra per l'emergenza {richiesta.InfoEmergenza.CodEmergenza} da parte del comando {richiesta.InfoEmergenza.CodComandoRichiedente}",
                Tipo = TipoNotifica.UpDateEmergenza,
                Data = DateTime.Now
            });
        }
    }

    public class NotifyRichiestaCra
    {
        public string CodComando { get; set; }
        public int NumDoa { get; set; }
        public string[] Dirigenti { get; set; }
        public Emergenza Emergenza { get; set; }
    }
}
