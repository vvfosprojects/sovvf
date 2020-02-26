using Microsoft.Extensions.Configuration;
using Persistence.MongoDB;
using SimpleInjector;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Persistence.MongoDB;
using SO115App.Persistence.MongoDB.GestioneInterventi;
using SO115App.Persistence.MongoDB.GestioneMezzi;
using SO115App.Persistence.MongoDB.Marker;
using SO115App.SignalR.Sender.GestioneSchedeContatto;

namespace SO115App.CompositionRoot
{
    internal static class PersistenceServicesConfigurator_MongoDB
    {
        internal static void Configure(Container container, IConfiguration configuration)
        {
            var connectionString = configuration.GetSection("DatabaseSettings").GetSection("ConnectionString").Value;
            var databaseName = configuration.GetSection("DatabaseSettings").GetSection("DatabaseName").Value;

            container.Register<DbContext>(() =>
                new DbContext(connectionString, databaseName), Lifestyle.Singleton);

            #region Gestione richiesta di assistenza

            container.Register<ISaveRichiestaAssistenza, SaveRichiesta>();
            container.Register<IUpDateRichiestaAssistenza, UpDateRichiesta>();

            container.Register<IGetRichiestaById, GetRichiesta>();
            container.Register<IGetListaSintesi, GetRichiesta>();

            container.Register<Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie.IGetTipologieByCodice,
                Persistence.MongoDB.GestioneInterventi.GestioneTipologie.GetTipologieByCodice>();

            #endregion Gestione richiesta di assistenza

            #region BOX

            container.Register<IGetBoxRichieste, GetBoxRichieste>();

            #endregion BOX

            #region MARKER

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetRichiesteMarker,
                GetRichiesteMarker>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IAddChiamataInCorso,
                AddChiamataInCorso>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IDeleteChiamataInCorso,
                DeleteChiamataInCorso>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IUpDateChiamataInCorso,
                UpdateChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetChiamateInCorso,
                GetChiamateInCorso>();

            #endregion MARKER

            #region StatoMezzo

            container.Register<
                    Models.Servizi.Infrastruttura.Composizione.ISetMezzoPrenotato,
                    SetMezzoPrenotato>();
            container.Register<Models.Servizi.Infrastruttura.Composizione.IGetStatoMezzi,
                    GetStatoMezzoByCodice>();

            #endregion StatoMezzo

            #region Schede Contatto

            container.Register<
                    Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IMergeSchedeContatto,
                    UpDateSchedeContatto>();

            container.Register<
                    Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationMergeSchedeNue,
                    NotificationMergeSchedeNue>();

            #endregion Schede Contatto

            #region DA TRASFORMARE SU MONGO

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetFiltri.IGetFiltri,
                FakePersistenceJSon.Filtri.GetFiltri>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetSediMarker,
                FakePersistenceJSon.Marker.GetSediMarker>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetCentroMappaMarker,
                FakePersistenceJSon.Marker.GetCentroMappa>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.NavBar.IGetNavbar,
                SO115App.FakePersistenceJSon.Navbar.GetNavbar>();

            container.Register<
               SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre.IGetComposizioneSquadre,
               SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper.GetComposizioneSquadre>();
            //container.Register<
            //    SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre.IGetComposizioneSquadre,
            //    FakePersistenceJSon.Composizione.GetComposizioneSquadre>();
            //   container.Register<
            //  SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati,
            //SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper.GetPreAccoppiati>();
            //container.Register<
            //    SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati,
            //    FakePersistenceJSon.Composizione.GetPreAccoppiati>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetListaEventi.IGetListaEventi,
                FakePersistenceJSon.ListaEventi.GetListaEventi>();

            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetIdByCodice,
                FakePersistenceJSon.GestioneIntervento.GetIdByCodice>();

            container.Register<
            SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetMezzoByCodice,
         SO115App.FakePersistence.JSon.GestioneMezzi.GetMezzoById>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta.IGeneraCodiceRichiesta,
                GeneraCodiceRichiesta>();
            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement.IGetDistaccamentoByCodiceSede,
                FakePersistence.JSon.Distaccamenti.GetDistaccamentoByCodiceSede>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.IGetUtenteById,
                SO115App.FakePersistence.JSon.GestioneUtenti.GetUtenteById>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IUpdateTurni,
                SO115App.FakePersistence.JSon.Turni.UpdateTurni>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IGetTurno,
                SO115App.FakePersistence.JSon.Turni.GetTurno>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.InfoRichiesta.IGetInfoRichiesta,
                FakePersistence.JSon.Utility.GetInfoRichiesta>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.ISetStatoOperativoMezzo,
                FakePersistence.JSon.GestioneMezzi.SetStatoOperativoMezzo>();

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
            container.Register<SO115App.Models.Servizi.Infrastruttura.Notification.GestioneSchedeContatto.INotificationSetSchedaLetta,
               SO115App.SignalR.Sender.GestioneSchedeContatto.NotificationSetSchedaLetta>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneUtenti.INotifyAddUtente, SignalR.Sender.GestioneUtenti.NotificationAddUtente>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneUtenti.INotifyDeleteUtente, SignalR.Sender.GestioneUtenti.NotificationDeleteUtente>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli.INotifyAddRuoli, SignalR.Sender.GestioneRuoli.NotificationAddRuoli>();
            container.Register<Models.Servizi.Infrastruttura.Notification.GestioneUtenti.GestioneRuoli.INotifyDeleteRuolo, SignalR.Sender.GestioneRuoli.NotificationDeleteRuolo>();

            container.Register<
                API.Models.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativaPerCodice,
                API.Models.Servizi.Infrastruttura.Organigramma.Implementazioni.GetUnitaOperativaPerCodice>();
            container.Register<
                API.Models.Servizi.Infrastruttura.Autenticazione.IGetOperatoreAutenticato,
                API.SOVVF.FakeImplementations.Modello.Autenticazione.GetOperatoreAutenticato>();
            container.Register<
                API.Models.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativaRadice,
                API.SOVVF.FakeImplementations.Modello.Organigramma.GetUnitaOperativaRadice_CON_Direzioni_ComLazio>();
            container.Register<
                API.Models.Servizi.Infrastruttura.Organigramma.IGetUnitaOperativeVisibiliPerSoccorso,
                API.SOVVF.FakeImplementations.Modello.Organigramma.GetUnitaOperativeVisibiliPerSoccorso_OperatoreDirezioneRegionaleLazio>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetSituazioneMezzi,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetSituazioneMezzi_RandomFake>();
            container.Register<
                API.Models.Servizi.Infrastruttura.Anagrafiche.IGetTipoInterventoByCodice,
                API.SOVVF.FakeImplementations.Modello.Infrastruttura.Anagrafiche.GetTipoInterventoByCodice_Fake>();
            container.Register<
                API.Models.Servizi.CQRS.Commands.GestioneSoccorso.SelezioneSquadra.CommandDTO.ITestAndSetSelezioneDisponibilitaSquadra,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaSquadra_Fake>();
            container.Register<
                API.Models.Classi.Soccorso.Risorse.ITestAndSetSelezioneDisponibilitaMezzo,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetSelezioneDisponibilitaMezzo_Fake>();
            container.Register<
                API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaSquadra.CommandDTO.ITestAndSetDeselezioneDisponibilitaSquadra,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaSquadra_DoNothing>();
            container.Register<
                API.Models.Servizi.CQRS.Commands.GestioneSoccorso.DeselezionaMezzo.CommandDTO.ITestAndSetDeselezioneDisponibilitaMezzo,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Risorse.TestAndSetDeselezioneDisponibilitaMezzo_DoNothing>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetRichiestaAssistenzaById,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.GetRichiestaAssistenzaById_Fake>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.RicercaRichiesteAssistenza.ICercaRichiesteAssistenza,
                API.Models.Classi.Soccorso.CercaRichiesteAssistenza_Empty>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetNumeroMezziSoccorsoOraInServizio,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetNumeroMezziSoccorsoOraInServizio_Fake>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetNumeroSquadreSoccorsoOraInServizio,
                API.SOVVF.FakeImplementations.Modello.GestioneSoccorso.Mezzi.GetNumeroSquadreSoccorsoOraInServizio_Fake>();
            container.Register<
                API.Models.Servizi.Infrastruttura.GestioneSoccorso.CompetenzeTerritoriali.IGetCompetenzeByPunto,
                API.SOVVF.FakeImplementations.Modello.Infrastruttura.CompetenzeTerritoriali.GetCompetenzeByPunto_Fake_Hardcoded>();

            #endregion DA TRASFORMARE SU MONGO

            #region Gestione Utenti e Ruoli

            container.Register<Models.Servizi.Infrastruttura.GestioneUtenti.IDeleteUtente, Persistence.MongoDB.GestioneUtenti.GestioneUtente.DeleteUtente>();
            container.Register<Models.Servizi.Infrastruttura.GestioneUtenti.IAddUtente, Persistence.MongoDB.GestioneUtenti.GestioneUtente.AddUtente>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Personale.IGetUtenti, Persistence.MongoDB.GestioneUtenti.GestioneUtente.GetUtenti>();
            container.Register<Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.IDeleteRuolo, Persistence.MongoDB.GestioneUtenti.GestioneRuoli.DeleteRuolo>();
            container.Register<Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.IAddRuoli, Persistence.MongoDB.GestioneUtenti.GestioneRuoli.AddRuoli>();

            #endregion Gestione Utenti e Ruoli
        }
    }
}
