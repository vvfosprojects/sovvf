using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Servizi;
using System;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using Microsoft.AspNetCore.Http;
using SO115App.API.Models.Servizi.CQRS.Commands;
using SO115App.API.Models.Servizi.CQRS.Queries;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.QueryDTO;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.SintesiRichiesteAssistenza.ResultDTO;
using SO115App.API.Models.Servizi.CQRS.Commands.GestioneSoccorso.InserisciTelefonata.CommandDTO;

namespace SO115App.API.Hubs
{
    public class NotificationHub : Hub
    {
    /*
      private readonly ICommandHandler<InserisciTelefonataCommand> _handler;

      public NotificationHub(ICommandHandler<InserisciTelefonataCommand> handler)
        {
            this._handler = handler;
        }
    */
        SintesiRichiesta sintesiRichiesta = new SintesiRichiesta();

        /// <summary>
        ///  Metodo di Salvataggio e Propagazione di una nuova chiamata
        /// </summary>   
        public async Task SaveAndNotifyChiamata(Notification<SintesiRichiesta> NuovaChiamata)
		{
            try
            {
                NuovaChiamata.ActionObj = sintesiRichiesta;

                //TODO Creare il metodo per l'inserimento della chiamata

                /* this._handler.Handle(NuovaChiamata.ActionObj); */

                /// <summary>
                ///  Propago il messaggio a tutti i client che appartengono al gruppo dell'utente che ha inserito la Chiamata
                /// </summary>                
                await Clients.OthersInGroup(NuovaChiamata.CodiceSede).SendAsync("SaveAndNotifySuccessChiamata", NuovaChiamata.ActionObj);

            }
            catch(Exception e)
            {
                /// <summary>
                ///  Ritorno l'errore solo al Client che ha provato a fare l'inserimento
                /// </summary>                 
                await Clients.User(Context.ConnectionId).SendAsync("SaveAndNotifyErrorChiamata", "Si è verificato il seguente errore: " + e.Message);            
            }
		}

        /// <summary>
        ///  Metodo di Modifica e Propagazione di una richiesta
        /// </summary>
        public async Task ModifyAndNotify(Notification<SintesiRichiesta> Richiesta)
		{
            try
            {
                Richiesta.ActionObj = sintesiRichiesta;

                //TODO Creare il metodo per la modifica della chiamata

                /* this._handler.Handle(Chiamata.ActionObj); */

                /// <summary>
                ///  Propago il messaggio a tutti i client che appartengono al gruppo dell'utente che ha inserito la Chiamata
                /// </summary>                
                await Clients.OthersInGroup(Richiesta.CodiceSede).SendAsync("ModifyAndNotifySuccess", Richiesta.ActionObj);

            }
            catch(Exception e)
            {
                /// <summary>
                ///  Ritorno l'errore solo al Client che ha provato a fare l'inserimento
                /// </summary>                 
                await Clients.User(Context.ConnectionId).SendAsync("ModifyAndNotifyError", "Si è verificato il seguente errore: " + e.Message);            
            }
		}

    }
}