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
using System.IO;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza;

namespace SO115App.API.Hubs
{
    public class NotificationHub : Hub
    {
        SintesiRichiesta sintesiRichiesta = new SintesiRichiesta();

        public async Task GetAndNotifyListaSintesi()
        {
            try{
                
                //Notifico all'utente la lista di tutte le Richieste presenti
                string ListaSintesiRichieste;
                ListaSintesiRichieste = GetListaSintesi();

                await Clients.Caller.SendAsync("NotifyGetListaRichieste", ListaSintesiRichieste);

            }
            catch(Exception ex)
            {
                await Clients.Caller.SendAsync("NotifyGetListaRichieste", ex.Message);
            }
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

        private string GetListaSintesi ()
        {
            //TODO DA MODIFICARE CON LA CONNESSIONE AL DB PER IL REPERIMENTO DEI DATI DEFINITIVI           
            //DATI FAKE - ORA LI LEGGO DA FILE
            string filepath = "fake.json";
            string json;
            using (StreamReader r = new StreamReader(filepath))
            {
                json = r.ReadToEnd();              
            }

            return json;
        }

    }
}