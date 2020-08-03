using SimpleInjector;
using SO115App.Models.Servizi.Infrastruttura.Notification.GestioneEnti;
using SO115App.SignalR.Sender.GestioneEnti;

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

            container.Register<
                Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationMergeSchedeNue,
                SignalR.Sender.GestioneSchedeContatto.NotificationMergeSchedeNue>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationUndoMergeSchedeNue,
                SignalR.Sender.GestioneSchedeContatto.NotificationUndoMergeSchedeNue>();
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
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento.INotifyMessaInLavorazioneRichiesta,
                SO115App.SignalR.Sender.GestioneIntervento.NotificationInserInLavorazione>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Notification.GestioneIntervento.INotifyDeleteInLavorazioneRichiesta,
                SO115App.SignalR.Sender.GestioneIntervento.NotificationDeleteInLavorazione>();
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
            container.Register<SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationSetSchedaGestita,
                SO115App.SignalR.Sender.GestioneSchedeContatto.NotificationSetSchedaGestita>();
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

            #endregion Notifiche
        }
    }
}
