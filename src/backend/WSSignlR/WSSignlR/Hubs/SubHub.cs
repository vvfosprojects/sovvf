using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using System;

namespace WSSignlR.Hubs
{
    public class SubHub : Hub
    {
        #region Add/Remove Group

        public void AddToGroup(Utente utente, string codSede)
        {
            try
            {
                Groups.AddToGroupAsync(Context.ConnectionId, codSede);
                Clients.Group(codSede).SendAsync("NotifyLogIn", "L'utente " + utente.Nome + " " + utente.Cognome + " è stato inserito nel gruppo " + codSede);
            }
            catch (Exception ex)
            {
                Clients.Caller.SendAsync("NotifyLogIn", ex.Message);
            }
            base.OnConnectedAsync();
        }

        public void RemoveToGroup(Utente utente, string codSede)
        {
            Groups.RemoveFromGroupAsync(Context.ConnectionId, codSede);
            Clients.Caller.SendAsync("NotifyLogOut", "L'utente " + utente.Nome + " " + utente.Cognome + " è uscito nel gruppo  " + codSede);
            base.OnConnectedAsync();
        }

        public string GetConnectionId()
        {
            return Context.ConnectionId;
        }

        public long GetDateTime()
        {
            return DateTimeOffset.Now.ToUnixTimeMilliseconds();
        }

        #endregion Add/Remove Group

        #region Aggiornamento BOX

        public void NotifyGetBoxInterventi(BoxInterventi boxInterventi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyGetBoxInterventi", boxInterventi);
        }

        #endregion Aggiornamento BOX

        #region Inserimento/Modifica Intervento

        public void SaveAndNotifySuccessChiamata(SintesiRichiesta sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("SaveAndNotifySuccessChiamata", sintesi);
        }

        public void ModifyAndNotifySuccess(SintesiRichiesta sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", sintesi);
        }

        #endregion Inserimento/Modifica Intervento

        #region Marker

        public void NotifyGetRichiestaMarker(SintesiRichiestaMarker sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", sintesi);
        }

        #endregion Marker

        #region Coda Chiamate

        public void NotifyAddChiamateCodaChiamate(CounterNotifica counter, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counter);
        }

        #endregion Coda Chiamate

        #region AFM

        public void NotifySuccessAnnullamentoAFM(SintesiRichiesta sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifySuccessAnnullamentoAFM", sintesi);
        }

        public void NotifyErrorAFM(String note, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyErrorAFM", note);
        }

        #endregion AFM
    }
}