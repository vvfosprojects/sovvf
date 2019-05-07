using System.Threading.Tasks;
using SO115App.API.Models.Classi.Notifications;
using Microsoft.AspNetCore.SignalR;
using System;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.API.Models.Classi.Autenticazione;
using System.Collections.Generic;

namespace SO115App.API.Hubs
{
    public class NotificationHub : Hub
    {        

        SintesiRichiesta sintesiRichiesta = new SintesiRichiesta();
        public async Task AddToGroup(Notification<Utente> utente)
        {
            try{
                await Groups.AddToGroupAsync(Context.ConnectionId, utente.CodiceSede);
            
                //Notifico a tutti i client che l'utente si è appena loggato
                await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogIn", "L'utente " + utente.NominativoUtente + " è stato inserito nella sede " + utente.CodiceSede);
                
            }
            catch(Exception ex)
            {
                await Clients.Caller.SendAsync("NotifyLogIn", ex.Message);
            }
            await base.OnConnectedAsync();
        }

        public async Task RemoveToGroup(Notification<Utente> utente)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, utente.CodiceSede);
            await Clients.OthersInGroup(utente.CodiceSede).SendAsync("NotifyLogOut", "L'utente " + utente.NominativoUtente + " è uscito dalla sede " + utente.CodiceSede);
            await base.OnConnectedAsync();
        }

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

        public string GetConnectionId()
        {
                return Context.ConnectionId;
        }

        public long GetDateTime()
        {                       
            return DateTimeOffset.Now.ToUnixTimeMilliseconds();
        }

        public List<SintesiRichiesta> GetListaSintesiRichieste()
        {
            
            return null;

        } 
    }
}