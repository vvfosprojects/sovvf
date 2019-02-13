using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi;
using System;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using Microsoft.AspNetCore.Http;

namespace SO115App.API.Hubs
{
    public class NotificationHub : Hub, IActionGeneric<Notification<SintesiRichiesta>>
    {
        
        SintesiRichiesta sintesiRichiesta = new SintesiRichiesta();

        public Boolean GetAutorization(String message)
        {

            return false;
            
        }
 
        public string Action(Notification<SintesiRichiesta> message)
        {
            sintesiRichiesta = null;

            return null;
        }

        public async Task SendNotification(Notification<SintesiRichiesta> _sintesi)
		{

            Boolean auth = GetAutorization(_sintesi.userId);

            if(auth)
            {
                Action(_sintesi);
                _sintesi.ActionObj = sintesiRichiesta;

                await Clients.Group("NomeSede").SendAsync("ReceiveMessage", _sintesi.ActionObj);

            }else
            {
                await Clients.Group("NomeSede").SendAsync("ReceiveMessage", "L'utente non è autorizzato ad eseguire l'operazione.");            
            }
		}

    }
}