using Microsoft.Extensions.Configuration;
using Persistence.MongoDB;
using SimpleInjector;
using SO115App.API.Models.Servizi.CQRS.Mappers.RichiestaSuSintesi;
using SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.Box;
using SO115App.Models.Servizi.Infrastruttura.GestioneDB;
using SO115App.Models.Servizi.Infrastruttura.GestioneDettaglioTipologie;
using SO115App.Models.Servizi.Infrastruttura.GestioneDocumentale;
using SO115App.Models.Servizi.Infrastruttura.GestionePOS;
using SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso;
using SO115App.Models.Servizi.Infrastruttura.GestioneStatoOperativoSquadra;
using SO115App.Models.Servizi.Infrastruttura.GestioneTriage;
using SO115App.Models.Servizi.Infrastruttura.GestioneZoneEmergenza;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Persistence.MongoDB;
using SO115App.Persistence.MongoDB.GestioneDB;
using SO115App.Persistence.MongoDB.GestioneDettaglioTipologia;
using SO115App.Persistence.MongoDB.GestioneDocumentale;
using SO115App.Persistence.MongoDB.GestioneInterventi;
using SO115App.Persistence.MongoDB.GestioneMezzi;
using SO115App.Persistence.MongoDB.GestionePOS;
using SO115App.Persistence.MongoDB.GestioneSedi;
using SO115App.Persistence.MongoDB.GestioneStatoSquadra;
using SO115App.Persistence.MongoDB.GestioneTriage;
using SO115App.Persistence.MongoDB.GestioneZoneEmergenza;

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

            container.Register<IResetDB, ResetDB>();
            container.Register<IWatchChangeSchedeNue, DbWatchForChange>();

            container.Register<ISetTipologie, SetTipologie>();

            container.Register<ICheckCongruitaPartenze, CheckCongruitaPartenze>();

            container.Register<IMapperRichiestaSuSintesi, MapperRichiestaAssistenzaSuSintesi>();

            #region Gestione richiesta di assistenza

            container.Register<IGetMaxCodicePartenza, GetMaxCodicePartenza>();
            container.Register<ISaveRichiestaAssistenza, SaveRichiesta>();
            container.Register<IUpDateRichiestaAssistenza, UpDateRichiesta>();

            container.Register<IGetRichiesta, GetRichiesta>();
            container.Register<IGetListaSintesi, GetRichiesta>();
            container.Register<IGetRiepilogoInterventi, GetRichiesta>();

            container.Register<Models.Servizi.Infrastruttura.GestioneSoccorso.GestioneTipologie.IGetTipologieByCodice,
                Persistence.MongoDB.GestioneInterventi.GestioneTipologie.GetTipologieByCodice>();
            container.Register<IGetSintesiRichiestaAssistenzaByCodice, GetRichiesta>();

            container.Register<SO115App.Models.Servizi.Infrastruttura.GetListaEventi.IGetListaEventi, GetListaEventiByCodiceRichiesta>();

            #endregion Gestione richiesta di assistenza

            #region BOX

            container.Register<IGetBoxRichieste, GetBoxRichieste>();

            #endregion BOX

            #region MARKER

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetRichiesteMarker,
                SO115App.Persistence.MongoDB.Marker.GetRichiesteMarker>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetCentroMappaMarker,
                SO115App.Persistence.MongoDB.Marker.GetCentroMappa>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetSediMarker,
                SO115App.Persistence.MongoDB.Marker.GetSediMarker>();

            #endregion MARKER

            #region Gestione Sedi

            container.Register<IGetCoordinateByCodSede, GetCoordinateByCodSede>();

            #endregion Gestione Sedi

            #region GestioneChiamataInCorso

            container.Register<Models.Servizi.Infrastruttura.Marker.IAddChiamataInCorso,
                SO115App.Persistence.MongoDB.Marker.AddChiamataInCorso>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IDeleteChiamataInCorso,
                SO115App.Persistence.MongoDB.Marker.DeleteChiamataInCorso>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IUpDateChiamataInCorso,
                SO115App.Persistence.MongoDB.Marker.UpdateChiamataInCorso>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetChiamateInCorso,
                SO115App.Persistence.MongoDB.Marker.GetChiamateInCorso>();
            container.Register<Models.Servizi.Infrastruttura.Marker.IDeleteChiamataInCorsoByIdUtente,
                SO115App.Persistence.MongoDB.Marker.DeleteChiamataInCorsoByIdUtente>();

            #endregion GestioneChiamataInCorso

            #region StatoMezzo

            container.Register<
                Models.Servizi.Infrastruttura.Composizione.ISetMezzoPrenotato,
                SetMezzoPrenotato>();
            container.Register<
                Models.Servizi.Infrastruttura.Composizione.IGetStatoMezzi,
                GetStatoMezzoByCodice>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.ISetStatoOperativoMezzo,
                SetStatoOperativoMezzo>();

            #endregion StatoMezzo

            #region StatoSquadra

            container.Register<ISetStatoSquadra, SetStatoSquadra>();
            container.Register<IGetStatoSquadra, GetStatoSquadra>();
            container.Register<IGetSquadraByCodiceMezzo, GetSquadreByCodiceMezzo>();

            #endregion StatoSquadra

            #region Schede Contatto

            container.Register<
                    Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IMergeSchedeContatto,
                    UpDateSchedeContatto>();

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IUndoSchedeContattoMerge,
                Persistence.MongoDB.GestioneSchedeContatto.UndoSchedeContattoMerge>();

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeContatto_WSNUE,
                                Persistence.MongoDB.GestioneSchedeContatto.GetSchedeContatto>();

            #endregion Schede Contatto

            #region Gestione Utenti e Ruoli

            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.IDeleteUtente,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.DeleteUtente>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.IAddUtente,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.AddUtente>();
            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.Personale.IGetUtenti,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.GetUtenti>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.IDeleteRuolo,
                Persistence.MongoDB.GestioneUtenti.GestioneRuoli.DeleteRuolo>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.IAddRuoli,
                Persistence.MongoDB.GestioneUtenti.GestioneRuoli.AddRuoli>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente.IFindUserByUsername,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.FindUserByUsername>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.IGetUtenteById,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.GetUtenteById>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.VerificaUtente.IVerificaLogIn,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.VerificaLogIn>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti.IGetUtentiByCodiciSedi,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.GetUtentiByCodiciSede>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GetUtenti.IGetUtenteByCF,
                Persistence.MongoDB.GestioneUtenti.GestioneUtente.GetUtenteByCF>();
            container.Register<
                Models.Servizi.Infrastruttura.Autenticazione.IGetAutorizzazioni,
                Persistence.MongoDB.GestioneUtenti.GestioneRuoli.GetAutorizzazioni>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.IGetRuoliById,
                Persistence.MongoDB.GestioneUtenti.GestioneRuoli.GetRuoliById>();
            container.Register<
                Models.Servizi.Infrastruttura.GestioneUtenti.GestioneRuolo.ICheckEsistenzaRuolo,
                Persistence.MongoDB.GestioneUtenti.GestioneRuoli.CheckEsistenzaRuolo>();

            #endregion Gestione Utenti e Ruoli

            #region Utility

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IGetTurno,
                SO115App.Persistence.MongoDB.GestioneInterventi.Utility.GetTurno>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Turni.IUpdateTurni,
                SO115App.Persistence.MongoDB.GestioneInterventi.Utility.UpDateTurni>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.InfoRichiesta.IGetInfoRichiesta,
                SO115App.Persistence.MongoDB.GestioneInterventi.Utility.GetInfoRichiesta>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetFiltri.IGetFiltri,
                SO115App.Persistence.MongoDB.GestioneFiltri.GetFiltri>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneSoccorso.GenerazioneCodiciRichiesta.IGeneraCodiceRichiesta,
                SO115App.Persistence.MongoDB.GestioneInterventi.GeneraCodiceRichiesta>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneLog.IWriteLog,
                SO115App.Persistence.MongoDB.GestioneLog.WriteLog>();

            #endregion Utility

            #region Rubrica

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti.IGetRubrica,
                SO115App.Persistence.MongoDB.GestioneRubrica.Enti.GetRubrica>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Categorie.IGetEnteCategorie,
                SO115App.Persistence.MongoDB.GestioneRubrica.Categorie.GetEnteCategorie>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti.IUpdateEnte,
                SO115App.Persistence.MongoDB.GestioneRubrica.Enti.UpdateEnte>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti.IAddEnte,
                SO115App.Persistence.MongoDB.GestioneRubrica.Enti.AddEnte>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GestioneRubrica.Enti.IDeleteEnte,
                SO115App.Persistence.MongoDB.GestioneRubrica.Enti.DeleteEnte>();

            #endregion Rubrica

            #region ZoneEmergenza

            container.Register<IGetZoneEmergenza, GetZoneEmergenza>();

            #endregion ZoneEmergenza

            #region TrasferimentoChiamata

            container.Register<
                Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.IAddTrasferimento,
                Persistence.MongoDB.GestioneTrasferimentiChiamate.AddTrasferimento>();

            container.Register<
                Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.IGetTrasferimenti,
                Persistence.MongoDB.GestioneTrasferimentiChiamate.GetTrasferimenti>();

            container.Register<
                Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.IDeleteTrasferimento,
                Persistence.MongoDB.GestioneTrasferimentiChiamate.DeleteTrasferimento>();

            container.Register<
                Models.Servizi.Infrastruttura.GestioneTrasferimentiChiamate.CodiciChiamate.IGetCodiciChiamate,
                Persistence.MongoDB.GestioneTrasferimentiChiamate.CodiciChiamate.GetCodiciChiamate>();

            #endregion TrasferimentoChiamata

            #region Dettaglio Tipologia

            container.Register<IAddDettaglioTipologia, AddDettaglioTipologia>();
            container.Register<IDeleteDettaglioTipologia, DeleteDettaglioTipologia>();
            container.Register<IModifyDettaglioTipologia, UpDateDettaglioTipologia>();
            container.Register<IGetListaDettaglioTipologia, GetListaDettagliTipologia>();
            container.Register<IGetListaDettagliTipologieByIdTipologia, GetListaDettagliTipologiaByIdTipologia>();

            #endregion Dettaglio Tipologia

            #region Triage

            container.Register<IAddTriage, AddTriage>();
            container.Register<IUpDateTriage, UpDateTriage>();
            container.Register<IGetTriage, GetTriage>();
            container.Register<IGetTriageData, GetTriageData>();

            #endregion Triage

            #region POS

            container.Register<ISavePos, SavePOS>();
            container.Register<IDeletePos, DeletePOS>();
            container.Register<IGetPOS, GetPOS>();
            container.Register<IEditPos, EditPOS>();

            #endregion POS

            #region Documentale

            container.Register<ISaveDoc, SaveDoc>();
            container.Register<IDeleteDoc, DeleteDoc>();
            container.Register<IGetDoc, GetDoc>();
            container.Register<IEditDoc, EditDoc>();

            #endregion Documentale
        }
    }
}
