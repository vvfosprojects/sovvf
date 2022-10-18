using CQRS.Queries;
using Microsoft.AspNetCore.SignalR;
using Serilog;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Boxes;
using SO115App.Models.Servizi.Infrastruttura.Box;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SO115App.SignalR.Sender.AggiornamentoBox
{
    public class NotificationAggiornaBox
    {
        private readonly IHubContext<NotificationHub> _notificationHubContext;
        private readonly IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> _boxRichiestehandler;
        private readonly IQueryHandler<BoxMezziQuery, BoxMezziResult> _boxMezzihandler;
        private readonly IGetBoxPersonale _boxPersonalehandler;

        public NotificationAggiornaBox(IHubContext<NotificationHub> notificationHubContext,
            IQueryHandler<BoxRichiesteQuery, BoxRichiesteResult> boxRichiestehandler,
            IQueryHandler<BoxMezziQuery, BoxMezziResult> boxMezzihandler,
            IGetBoxPersonale boxPersonalehandler)
        {
            _notificationHubContext = notificationHubContext;
            _boxRichiestehandler = boxRichiestehandler;
            _boxMezzihandler = boxMezzihandler;
            _boxPersonalehandler = boxPersonalehandler;
        }

        public void SendNotification(List<string> listaSediDaNotificare)
        {
            Parallel.ForEach(listaSediDaNotificare, sede =>
           {
               if (sede != null)
               {
                   var boxRichiesteQuery = new BoxRichiesteQuery()
                   {
                       CodiciSede = new string[] { sede }
                   };
                   var boxInterventi = _boxRichiestehandler.Handle(boxRichiesteQuery).BoxRichieste;

                   Log.Information($"*************NOTIFICA BOX INTERVENTI PER SEDE {sede}");
                   _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);

                   var boxMezziQuery = new BoxMezziQuery()
                   {
                       CodiciSede = new string[] { sede }
                   };
                   var boxMezzi = _boxMezzihandler.Handle(boxMezziQuery).BoxMezzi;
                   Log.Information($"*************NOTIFICA BOX INTERVENTI PER MEZZI {sede}");
                   _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxMezzi", boxMezzi);

                   Log.Information($"*************INIZIO NOTIFICA BOX INTERVENTI PER MEZZI {sede}");
                   var boxPersonale = _boxPersonalehandler.Get(new string[] { sede });
                   Log.Information($"*************FINE NOTIFICA BOX INTERVENTI PER MEZZI {sede}");
                   _notificationHubContext.Clients.Group(sede).SendAsync("NotifyGetBoxPersonale", boxPersonale);
               }
           });
        }
    }
}
