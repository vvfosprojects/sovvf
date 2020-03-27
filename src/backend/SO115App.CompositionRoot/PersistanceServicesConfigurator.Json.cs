using SimpleInjector;
using SO115App.FakePersistenceJSon.Composizione;
using SO115App.FakePersistenceJSon.GestioneMezzi;
using SO115App.FakePersistenceJSon.Marker;

namespace SO115App.CompositionRoot
{
    internal static class PersistanceServicesConfigurator_Json
    {
        internal static void Configure(Container container)
        {           
            Configure_JsonDatabase(container, false);            
        }

        private static void Configure_JsonDatabase(Container container, bool v)
        {
            #region Chiamate In Corso
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IAddChiamataInCorso,
                FakePersistenceJSon.Marker.AddChiamateInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetChiamateInCorso,
                FakePersistenceJSon.Marker.GetChiamateInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IDeleteChiamataInCorso,
                FakePersistenceJSon.Marker.DelChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IUpDateChiamataInCorso,
                FakePersistenceJSon.Marker.UpDateChiamateInCorso>();
            #endregion

            #region Marker 
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetMezziMarker,
                GetMezziMarker>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetRichiesteMarker,
                FakePersistenceJSon.Marker.GetRichiesteMarker>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetSediMarker,
                FakePersistenceJSon.Marker.GetSediMarker>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetCentroMappaMarker,
                FakePersistenceJSon.Marker.GetCentroMappa>();
            #endregion Marker

            #region Box
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Box.IGetBoxMezzi,
                SO115App.FakePersistenceJSon.Box.GetBoxMezzi>();
            #endregion Box

            #region Utility
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetFiltri.IGetFiltri,
                FakePersistenceJSon.Filtri.GetFiltri>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.NavBar.IGetNavbar,
                SO115App.FakePersistenceJSon.Navbar.GetNavbar>();
            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement.IGetDistaccamentoByCodiceSede,
                FakePersistence.JSon.Distaccamenti.GetDistaccamentoByCodiceSede>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IUpdateTurni,
                SO115App.FakePersistence.JSon.Turni.UpdateTurni>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IGetTurno,
                SO115App.FakePersistence.JSon.Turni.GetTurno>();
            #endregion Utility

            #region Getione Mezzi
            container.Register<
                Models.Servizi.Infrastruttura.Composizione.ISetMezzoPrenotato,
                FakePersistence.JSon.Composizione.SetMezzoPrenotato>();
            container.Register<Models.Servizi.Infrastruttura.Composizione.IGetStatoMezzi,
                FakePersistence.JSon.GestioneMezzi.GetStatoMezzi>();
            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetMezzoByCodice,
                SO115App.FakePersistence.JSon.GestioneMezzi.GetMezzoById>();
            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetListaMezzi,
                GetListaMezzi>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.ISetStatoOperativoMezzo,
                FakePersistence.JSon.GestioneMezzi.SetStatoOperativoMezzo>();
            #endregion Gestione Mezzi


            #region Gestione Utenti
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneUtenti.IGetUtenteById,
                SO115App.FakePersistence.JSon.GestioneUtenti.GetUtenteById>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente.IFindUserByUsername,
                FakePersistence.JSon.GestioneUtenti.FindByUsername>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.IGetUtenteById,
                FakePersistence.JSon.GestioneUtenti.GetUtenteById>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente.IVerificaLogIn,
                FakePersistence.JSon.GestioneUtenti.VerificaLogIn>();
            #endregion Gestione Utenti

            #region Partenze 
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateConfermaPartenze,
                UpdateConfermaPartenze>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateStatoPartenze,
                UpdateStatoPartenza>();
            #endregion Partenze

            #region Gestione Richiesta
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetListaEventi.IGetListaEventi,
                FakePersistenceJSon.ListaEventi.GetListaEventi>();
            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.IGetIdByCodice,
                FakePersistenceJSon.GestioneIntervento.GetIdByCodice>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta.IGeneraCodiceRichiesta,
                SO115App.FakePersistence.JSon.Utility.GeneraCodiceRichiesta>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.InfoRichiesta.IGetInfoRichiesta,
                FakePersistence.JSon.Utility.GetInfoRichiesta>();
            #endregion Gestione Richiesta

        }
    }
}
