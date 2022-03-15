using DomainModel.CQRS.Commands.AllertaAltreSedi;
using DomainModel.CQRS.Commands.ChiamataInCorsoMarker;
using DomainModel.CQRS.Commands.GestioneFonogramma;
using DomainModel.CQRS.Commands.PresaInCarico;
using DomainModel.CQRS.Commands.RimozionePresaInCarico;
using DomainModel.CQRS.Commands.UpDateStatoRichiesta;
using Microsoft.AspNetCore.SignalR;
using SO115App.API.Models.Classi.Autenticazione;
using SO115App.API.Models.Classi.Boxes;
using SO115App.API.Models.Classi.Marker;
using SO115App.API.Models.Servizi.CQRS.Queries.GestioneSoccorso.Shared.SintesiRichiestaAssistenza;
using SO115App.Models.Classi.CodaChiamate;
using SO115App.Models.Classi.Condivise;
using SO115App.Models.Classi.ListaMezziInServizio;
using SO115App.Models.Classi.RubricaDTO;
using SO115App.Models.Servizi.CQRS.Commands.GestioneSoccorso.GestioneIntervento.GestioneEntiIntervenuti;
using System;
using System.Collections.Generic;

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

        public void ChangeStateSuccess(bool esito, string sede)
        {
            Clients.Group(sede).SendAsync("ChangeStateSuccess", esito);
        }

        #endregion Inserimento/Modifica Intervento

        #region Partenza

        public void NotifyUpdateMezzoInServizio(MezzoInServizio mezzo, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyUpdateMezzoInServizio", mezzo);
        }

        #endregion Partenza

        #region Marker

        public void NotifyGetRichiestaMarker(SintesiRichiestaMarker sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyGetRichiestaMarker", sintesi);
        }

        public void NotifyChiamataInCorsoMarkerAdd(ChiamataInCorsoMarkerCommand sintesi, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyChiamataInCorsoMarkerAdd", sintesi);
        }

        public void NotifyChiamataInCorsoMarkerDelete(string idChiamataInCorso, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyChiamataInCorsoMarkerDelete", idChiamataInCorso);
        }

        public void NotifyDoppioneChiamataInCorso(string Note, string HubId)
        {
            Clients.Client(HubId).SendAsync("NotifyDoppioneChiamataInCorso", Note);
        }

        public void NotifyChiamataInCorsoMarkerUpdate(UpDateChiamataInCorsoMarkerCommand chiamata, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyChiamataInCorsoMarkerUpdate", chiamata);
        }

        #endregion Marker

        #region Coda Chiamate

        public void NotifyAddChiamateCodaChiamate(CounterNotifica counter, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddChiamateCodaChiamate", counter);
        }

        public void NotifyAddSquadreOccupateCodaChiamate(CounterNotifica counter, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddSquadreOccupateCodaChiamate", counter);
        }

        public void NotifyRemoveSquadreLibereCodaChiamate(CounterNotifica counter, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyRemoveSquadreLibereCodaChiamate", counter);
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

        #region Tipologie

        public void NotifyAddDettaglioTipologia(Paginazione paginazione, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddDettaglioTipologia", paginazione);
        }

        public void NotifyDeleteDettaglioTipologia(Paginazione paginazione, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyDeleteDettaglioTipologia", paginazione);
        }

        public void NotifyModifyDettaglioTipologia(Paginazione paginazione, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyModifyDettaglioTipologia", paginazione);
        }

        #endregion Tipologie

        #region Documentale

        public void NotifyAddDoc(string messaggio, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddDoc", messaggio);
        }

        #endregion Documentale

        #region Enti

        public void NotifyAddEnte(Paginazione info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAddEnte", info);
        }

        public void NotifyDeleteEnte(Paginazione info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyDeleteEnte", info);
        }

        public void NotifyUpdateEnte(Paginazione info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyUpdateEnte", info);
        }

        public void NotifyChangeEnti(List<EnteDTO> info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyChangeEnti", info);
        }

        public void ModifyAndNotifySuccessEntiIntervenuti(EntiIntervenutiCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        #endregion Enti

        #region Fonogramma

        public void ModifyAndNotifySuccessFonogramma(FonogrammaCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        #endregion Fonogramma

        #region Intervento

        public void ModifyAndNotifySuccessAllerta(AllertaAltreSediCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        public void NotifyAllertaAltreSedi(SintesiRichiesta info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyAllertaAltreSedi", info);
        }

        public void NotifyDeleteAllertaAltreSedi(string info, string sede)
        {
            Clients.Group(sede).SendAsync("NotifyDeleteAllertaAltreSedi", info);
        }

        public void ModifyAndNotifySuccessRimozionePresaInCarico(RimozionePresaInCaricoCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        public void ModifyAndNotifySuccessPresaInCarico(PresaInCaricoCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        public void ModifyAndNotifyUpdateStatoRichiesta(UpDateStatoRichiestaCommand info, string sede)
        {
            Clients.Group(sede).SendAsync("ModifyAndNotifySuccess", info);
        }

        #endregion Intervento
    }
}