using SimpleInjector;

namespace SO115App.CompositionRoot
{
    internal static class FakeConfigurator
    {
        internal static void Configure(Container container)
        {
            #region UtentiComuneFake

            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Personale.IGetPersonaleVVF, ExternalAPI.Fake.Servizi.Personale.GetPersonaleVVF>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE
            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Personale.IGetPersonaleByCF, ExternalAPI.Fake.Servizi.Personale.GetPersonaleByCF>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE
            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.IGetDistaccamentoByCodiceSedeUC, GetDistaccamentoByCodiceSede>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE

            #endregion UtentiComuneFake

            #region GeofleetFake

            //container.Register<Models.Servizi.Infrastruttura.GeoFleet.IGetPosizioneByCodiceMezzo, GetPosizioneByCodiceMezzo>();//TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE

            #endregion GeofleetFake

            #region GacFake

            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Gac.IGetMezziUtilizzabili, ExternalAPI.Fake.GestioneMezzi.GetMezziUtilizzabili>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE

            #endregion GacFake

            #region UOSFake

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede.IGetAlberaturaUnitaOperative, ExternalAPI.Fake.Uos.GetListaSediAlberata>();

            #endregion UOSFake

            #region SquadreFake

            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetListaSquadre, ExternalAPI.Fake.Servizi.Personale.GetListaSquadre>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE

            #endregion SquadreFake

            #region PreaccopiatiFake

            container.Register<SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati, ExternalAPI.Fake.Servizi.Preaccoppiati.GetPreAccoppiati>(); //TODO DA CAMBIARE CLASSE CHE INIETTA L'INTERFACCIA SUL SERVIZIO API FAKE

            #endregion PreaccopiatiFake

            #region NueFake

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContatto, ExternalAPI.Fake.Servizi.Nue.GetSchedeContatto>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedaContattoAttuale, ExternalAPI.Fake.Nue.GetSchedaContattoAttuale>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoBySpatialArea, ExternalAPI.Fake.Nue.GetSchedeContattoBySpatialArea>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoByCodiciFiscali, ExternalAPI.Fake.Nue.GetSchedeContattoByCodiciFiscali>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoByTipo, ExternalAPI.Fake.Nue.GetSchedeContattoByListTipo>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoByText, ExternalAPI.Fake.Nue.GetSchedeContattoByText>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoGestita, ExternalAPI.Fake.Nue.GetSchedeContattoGestita>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoTimeSpan, ExternalAPI.Fake.Nue.GetSchedeContattoTimeSpan>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.ISetStatoGestioneSchedaContatto, ExternalAPI.Fake.Nue.SetGestita>();
            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContattoMarkerFiltered, ExternalAPI.Fake.Servizi.Nue.GetSchedeContattoMarkerFiltered>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetConteggioSchede, ExternalAPI.Fake.Servizi.Nue.GetConteggioSchede>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeFiltrate, ExternalAPI.Fake.Servizi.Nue.GetSchedeFiltrate>();

            #endregion NueFake

            #region SediFake

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede.IGetAlberaturaUnitaOperative, ExternalAPI.Fake.Uos.GetListaSediAlberata>();

            #endregion SediFake

            #region CompetenzeFake

            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Competenze.IGetListaCompetenze, ExternalAPI.Fake.ImportOracle.CompetenzeMapper.GetCompetenze>(); TODO Creare classe che restituisce le tre competenze in maniera statica
            //container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Competenze.IGetCompetenzeRichiesta, ExternalAPI.Fake.ImportOracle.CompetenzeMapper.GetCompetenzeByNomeVia>(); TODO Creare classe che restituisce le tre competenze in maniera statica

            #endregion CompetenzeFake
        }
    }
}
