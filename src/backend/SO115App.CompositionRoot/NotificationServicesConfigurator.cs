using SimpleInjector;
using SO115App.Models.Servizi.Infrastruttura.Notification.AllertaAltreSedi;
using SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDettaglioTipologia;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneDocumentale;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEntiIntervenuti;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTrasferimentiChiamate;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneTriage;
using SO115App.SignalR.Sender.ComposizionePartenza;
using SO115App.SignalR.Sender.GestioneDettaglioTipologia;
using SO115App.SignalR.Sender.GestioneDocumentale;
using SO115App.SignalR.Sender.GestioneEnti;
using SO115App.SignalR.Sender.GestioneFonogramma;
using SO115App.SignalR.Sender.GestioneIntervento;
using SO115App.SignalR.Sender.GestionePartenza;
using SO115App.SignalR.Sender.GestionePos;
using SO115App.SignalR.Sender.GestioneTrasferimentiChiamate;
using SO115App.SignalR.Sender.GestioneTriage;

namespace SO115App.CompositionRoot
{
    internal static class NotificationServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            Configure_NotificationServices(container, false);
        }

        private static void Configure_NotificationServices(Container container, bool v)
        {
            #region Notifiche

            container.Register<INotificationAnnullaRichiestaSoccorsoAereo, NotificationAnnullaRichiestaSoccorsoAereo>();
            container.Register<INotificationInserisciRichiestaSoccorsoAereo, NotificationInserisciRichiestaSoccorsoAereo>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata.INotifyInserimentoChiamata,
                SO115App.SignalR.Sender.GestioneChiamata.NotificationInserimentoChiamata>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamata.INotifyUpDateChiamata,
                SO115App.SignalR.Sender.GestioneChiamata.NotificationUpDateChiamata>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso.INotificationAddChiamataInCorso,
                SO115App.SignalR.Sender.GestioneChiamateInCorso.NotificationAddChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso.INotificationDoubleChiamataInCorso,
                SO115App.SignalR.Sender.GestioneChiamateInCorso.NotificationDoubleChiamata>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso.INotificationDeleteChiamataInCorso,
                SO115App.SignalR.Sender.GestioneChiamateInCorso.NotificationDeleteChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneChiamateInCorso.INotificationUpDateChiamataInCorso,
                SO115App.SignalR.Sender.GestioneChiamateInCorso.NotificationUpDateChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza.MezzoPrenotato.INotificationAddPrenotazioneMezzo,
                SignalR.Sender.ComposizionePartenza.GestioneMezzoPrenotato.NotificationAddPrenotazioneMezzo>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.ComposizionePartenza.INotificationConfermaPartenze,
                SO115App.SignalR.Sender.ComposizionePartenza.NotificationConfermaPartenze>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza.INotifyAnnullaPartenza,
                SO115App.SignalR.Sender.GestionePartenza.NotificationAnnullaPartenza>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento.INotifyDeletePresaInCaricoRichiesta,
                SO115App.SignalR.Sender.GestioneIntervento.NotificationDeletePresaInCarico>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento.INotifyPresaInCaricoRichiesta,
                SO115App.SignalR.Sender.GestioneIntervento.NotificationPresaInCarico>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestionePartenza.INotifyAggiornaStatoMezzo,
                SO115App.SignalR.Sender.GestionePartenza.NotificationAggiornaStatoMezzo>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento.INotifyUpDateStatoRichiesta,
                SO115App.SignalR.Sender.GestioneIntervento.NotificationUpDateStato>();
            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneUtenti.INotifyAddUtente,
                SignalR.Sender.GestioneUtenti.NotificationAddUtente>();
            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneUtenti.INotifyDeleteUtente,
                SignalR.Sender.GestioneUtenti.NotificationDeleteUtente>();
            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli.INotifyAddRuoli,
                SignalR.Sender.GestioneRuoli.NotificationAddRuoli>();
            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli.INotifyDeleteRuolo,
                SignalR.Sender.GestioneRuoli.NotificationDeleteRuolo>();

            container.Register<
                Models.Servizi.Infrastruttura.Notification.CallMatrix.ICallMatrix,
                SignalR.Utility.CallMatrix>();

            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneFonogramma.INotifyAddFonogramma,
                SignalR.Sender.GestioneFonogramma.NotificationAddFonogramma>();

            container.Register<INotificationAddEnte, NotificationAddEnte>();
            container.Register<INotificationUpdateEnte, NotificationUpdateEnte>();
            container.Register<INotificationDeleteEnte, NotificationDeleteEnte>();

            container.Register<INotificationAddTrasferimento, NotificationAddTrasferimento>();
            container.Register<INotificationDeleteTrasferimento, NotificationDeleteTrasferimento>();

            container.Register<INotificationAllertaAltreSedi, NotificationAllertaAltreSedi>();

            container.Register<INotifyModificaPartenza, NotificationModificaPartenza>();

            container.Register<INotifyAddEntiIntervenuti, NotificationAddEntiIntervenuti>();

            #endregion Notifiche

            #region Dettaglio Tipologia

            container.Register<INotificationAddDettaglioTipologia, NotificationAddDettaglioTipologia>();
            container.Register<INotificationDeleteDettaglioTipologia, NotificationDeleteDettaglioTipologia>();
            container.Register<INotificationModifyDettaglioTipologia, NotificationModifyDettaglioTipologia>();

            #endregion Dettaglio Tipologia

            #region Triage

            container.Register<INotificationAddTriage, NotificationAddTriage>();
            container.Register<INotificationUpDateTriage, NotificationUpDateTriage>();

            #endregion Triage

            #region POS

            container.Register<INotificationAddPos, NotificationAddPos>();

            #endregion POS

            #region Documentale

            container.Register<INotificationAddDoc, NotificationAddDoc>();

            #endregion Documentale

            #region SchedeContatto

            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationMergeSchedeNue,
                SignalR.Sender.GestioneSchedeContatto.NotificationMergeSchedeNue>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationUndoMergeSchedeNue,
                SignalR.Sender.GestioneSchedeContatto.NotificationUndoMergeSchedeNue>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationSetSchedaGestita,
                SO115App.SignalR.Sender.GestioneSchedeContatto.NotificationSetSchedaGestita>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationContatoreSchedeNue,
                SO115App.SignalR.Sender.GestioneSchedeContatto.NotificationContatoreSchedeNue>();

            #endregion SchedeContatto
        }
    }
}
