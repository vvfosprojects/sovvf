//-----------------------------------------------------------------------
// <copyright file="ServicesConfigurator.cs" company="CNVVF">
// Copyright (C) 2017 - CNVVF
//
// This file is part of SOVVF.
// SOVVF is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// SOVVF is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see http://www.gnu.org/licenses/.
// </copyright>
//-----------------------------------------------------------------------
using ExternalAPI.Fake.Servizi.Personale;
using Microsoft.Extensions.Caching.Memory;
using SimpleInjector;
using SO115App.ExternalAPI.Fake.Nue;
using SO115App.ExternalAPI.Fake.Personale;
using SO115App.ExternalAPI.Fake.Servizi.AFM;
using SO115App.ExternalAPI.Fake.Servizi.DistaccamentoUtentiComuni;
using SO115App.ExternalAPI.Fake.Servizi.ESRI;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.ExternalAPI.Fake.Servizi.GeoFleet;
using SO115App.ExternalAPI.Fake.Servizi.GestioneSedi;
using SO115App.ExternalAPI.Fake.Servizi.Identity;
using SO115App.ExternalAPI.Fake.Servizi.Nue;
using SO115App.ExternalAPI.Fake.Servizi.OPService;
using SO115App.ExternalAPI.Fake.Servizi.Personale;
using SO115App.ExternalAPI.Fake.Servizi.Qualifiche;
using SO115App.ExternalAPI.Fake.Servizi.Rubrica;
using SO115App.ExternalAPI.Fake.Servizi.STATRI;
using SO115App.ExternalAPI.Fake.Territorio;
using SO115App.ExternalAPI.Fake.Uos;
using SO115App.Models.Servizi.CustomMapper;
using SO115App.Models.Servizi.Infrastruttura.Composizione;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.Notification.CallESRI;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.AFM;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.OPService;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Qualifiche;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Rubrica;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Statri;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Linq;

namespace SO115App.CompositionRoot
{
    internal static class ExternalAPIFakeServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            container.Register<IMemoryCache>(() => new MemoryCache(
                new MemoryCacheOptions()
                {
                    ExpirationScanFrequency = TimeSpan.FromHours(2)
                }
                ), Lifestyle.Singleton);

            //SERVIZI GENERICI
            container.Register(typeof(ExternalAPI.Client.IHttpRequestManager<>), typeof(ExternalAPI.Client.IHttpRequestManager<>).Assembly.DefinedTypes.First(n => n.Name.Contains("HttpRequestManager")));

            container.Register<IGetToken, GetToken>();

            #region IdentityManagement

            container.Register<IGetAnagraficaComponente, GetAnagraficaComponente>();

            #endregion IdentityManagement

            #region OPService

            container.Register<IGetSquadre, GetSquadre>();
            container.Register<IGetAllSquadre, GetAllSquadre>();
            container.Register<ISetStatoSquadra, SetStatoSquadra>();

            #endregion OPService

            #region Qualifiche

            container.Register<IGetPercorsoByIdQualifica, GetPercorsoByIdQualifica>();
            container.Register<IGetDettaglioQualificaByIdDipendenteByDate, GetDettaglioQualificaByIdDipendenteByDate>();

            #endregion Qualifiche

            #region NUE

            container.Register<IGetRubrica, RubricaExt>();
            container.Register<IGetSchedeContatto, GetSchedeContatto>();
            container.Register<IGetSchedaContattoAttuale, GetSchedaContattoAttuale>();
            container.Register<IGetSchedeContattoBySpatialArea, GetSchedeContattoBySpatialArea>();
            container.Register<IGetSchedeContattoByCodiciFiscali, GetSchedeContattoByCodiciFiscali>();
            container.Register<IGetSchedeContattoByTipo, GetSchedeContattoByListTipo>();
            container.Register<IGetSchedeContattoByText, GetSchedeContattoByText>();
            container.Register<IGetSchedeContattoGestita, GetSchedeContattoGestita>();
            container.Register<IGetSchedeContattoTimeSpan, GetSchedeContattoTimeSpan>();
            container.Register<ISetStatoGestioneSchedaContatto, SetGestita>();
            container.Register<IGetSchedeContattoMarkerFiltered, GetSchedeContattoMarkerFiltered>();
            container.Register<IGetSchedeContattoByCodiciScheda, GetSchedeContattoByCodiciScheda>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetConteggioSchede,
                GetConteggioSchede>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeFiltrate,
               GetSchedeFiltrate>();

            #endregion NUE

            #region Territorio

            container.Register<IGetAlberaturaISTAT, GetListaAlberaturaRegioni>();

            #endregion Territorio

            #region Personale

            container.Register<IGetIdDipendentiByCodUnitaOrg, GetIdDipendentiByCodUnitaOrg>();
            container.Register<IGetDettaglioDipendenteById, GetDettaglioDipendenteById>();
            container.Register<IGetSquadreBySede, GetSquadreBySede>();
            container.Register<IGetPersonaFisica, GetPersonaFisica>();
            container.Register<IGetSquadreNelTurno, GetSquadreNelTurno>();
            container.Register<IGetPersonaleVVF, GetPersonaleVVF>();
            container.Register<IGetPersonaleByCF, GetPersonaleByCF>();
            container.Register<IGetPersonaleByCodSede, GetPersonaleByCodSede>();

            #endregion Personale

            #region GeoFleet

            container.Register<IGetInRettangolo, GetInRettangolo>();
            container.Register<IGetProssimita, GetProssimita>();
            container.Register<IGetPosizioneByCodiceMezzo, GetPosizioneByCodiceMezzo>();
            container.Register<IGetPosizioneFlotta, GetPosizioneFlotta>();

            #endregion GeoFleet

            #region Gac

            container.Register<IModificaInterventoChiuso, ModificaInterventoChiuso>();
            container.Register<ISetRientroMezzo, SetRientroMezzo>();
            container.Register<ISetUscitaMezzo, SetUscitaMezzo>();
            container.Register<IGetMezziByICCID, GetMezziByICCID>();
            container.Register<IGetMezziByCodiceMezzo, SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetMezziByCodiceMezzo>();
            container.Register<IGetMezziBySelettiva, GetMezziBySelettiva>();
            container.Register<IGetMezziFuoriServizio, GetMezziFuoriServizio>();
            container.Register<ISetMovimentazione, SetMovimentazione>();
            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetMezziInServizio,
                GetMezziInServizio>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateConfermaPartenze,
                ExternalAPI.Fake.Composizione.UpdateConfermaPartenzeExt>();
            container.Register<
                 SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateStatoPartenze,
                ExternalAPI.Fake.Composizione.UpdateStatoPartenzaExt>();

            container.Register<
               SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi.IGetComposizioneMezzi,
               //#if DEBUG
               //SO115App.FakePersistenceJSon.Composizione.GetComposizioneMezzi>();
               //#endif
               //#if !DEBUG
               SO115App.ExternalAPI.Fake.Composizione.GetComposizioneMezzi>();
            //#endif
            container.Register<ISetMezzoLibero, SetMezzoLibero>();
            container.Register<ISetMezzoOccupato, SetMezzoOccupato>();

            #endregion Gac

            #region Sedi

            container.Register<IGetSedeAssociazioniByCodSede, GetSedeAssociazioniByCodSede>();
            container.Register<IGetAlberaturaUnitaOperative, GetListaSediAlberata>();

            #endregion Sedi

            #region Box

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Box.IGetBoxMezzi,
                ExternalAPI.Fake.Box.GetBoxMezziExt>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre.IGetComposizioneSquadrePerBox,
                ExternalAPI.Fake.Composizione.GetComposizioneSquadrePerBox>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac.IGetMezziUtilizzabiliPerBox,
                ExternalAPI.Fake.GestioneMezzi.GetMezziUtilizzabiliPerBox>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetListaSquadrePerBox,
                ExternalAPI.Fake.Servizi.Personale.GetListaSquadrePerBox>();

            container.Register<
               SO115App.Models.Servizi.Infrastruttura.Box.IGetBoxPersonale,
               ExternalAPI.Fake.Box.GetBoxPersonale>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetMezziMarker,
                ExternalAPI.Fake.Marker.GetMezziMarkerExt>();

            #endregion Box

            #region Mezzi

            //container.Register<
            //   SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi.IGetListaMezzi,
            //   SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetListaMezzi>();

            //container.Register<
            //    SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi.IGetMezzoById,
            //    SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetMezzoById>();
            container.Register<IGetMezziUtilizzabili, GetMezziUtilizzabili>();

            container.Register<
                IGetMezziUtilizzabiliByAreaMappa,
                ExternalAPI.Fake.GestioneMezzi.GetMezziUtilizzabiliByAreaMappa>();

            #endregion Mezzi

            #region Squadre

            container.Register<
              SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetListaSquadre,
              SO115App.ExternalAPI.Fake.Servizi.Personale.GetListaSquadre>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetSquadraById,
                SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper.GetSquadraById>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetComposizioneSquadre.IGetComposizioneSquadre,
                //#if DEBUG
                //SO115App.FakePersistenceJSon.Composizione.GetComposizioneSquadre>();
                //#endif
                //#if !DEBUG
                SO115App.ExternalAPI.Fake.Composizione.GetComposizioneSquadre>();
            //#endif

            #endregion Squadre

            #region GesPreaccoppiati

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati.IGetListaGesPreaccoppiati,
                SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper.GetListaGesPreaccoppiati>();

            //  container.Register<
            //  SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati,
            //SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper.GetPreAccoppiati>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati,
                SO115App.ExternalAPI.Fake.Servizi.Preaccoppiati.GetPreAccoppiati>();

            #endregion GesPreaccoppiati

            #region Competenze

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze.IGetListaCompetenze,
                SO115App.ExternalAPI.Fake.ImportOracle.CompetenzeMapper.GetCompetenze>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Competenze.IGetCompetenzeRichiesta,
                SO115App.ExternalAPI.Fake.ImportOracle.CompetenzeMapper.GetCompetenzeByNomeVia>();

            #endregion Competenze

            #region Distaccamenti

            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement.IGetDistaccamentoByCodiceSede,
                SO115App.ExternalAPI.Fake.Servizi.DistaccamentoUtentiComuni.GetDistaccamentoByCodiceSede>();

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.IGetListaDistaccamentiByCodiceSede,
                SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper.GetDistaccamentiByCodSede>();
            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.IGetDistaccamentoByCodiceSedeUC,
                GetDistaccamentoByCodiceSede>();
            container.Register<
                Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.CoordinateTask.IGetCoordinateDistaccamento,
                ExternalAPI.Fake.Servizi.DistaccamentoCoordinate.GetCoordinateDistaccamento>();

            #endregion Distaccamenti

            #region Tipologie

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Tipologie.IGetListaTipologie, ExternalAPI.Fake.ImportOracle.TipologieMapper.GetTipologie>();

            #endregion Tipologie

            #region AFM

            container.Register<IGetCategorieSoccorsoAereo, GetCategorieSoccorsoAereo>();
            container.Register<IGetInfoRichiestaSoccorsoAereo, GetInfoRichiestaSoccorsoAereo>();
            container.Register<IGetTipologieRichiestaSoccorsoAereo, GetTipologieSoccorsoAereo>();
            container.Register<IAggiornaRichiestaSoccorsoAereo, AggiornaRichiestaSoccorsoAereo>();
            container.Register<IAnnullaRichiestaSoccorsoAereo, AnnullaRichiestaSoccorsoAereo>();
            container.Register<IInserisciRichiestaSoccorsoAereo, InserisciRichiestaSoccorsoAereo>();
            container.Register<IGetHistoryRichiestaSoccorsoAereo, GetHistoryRichiestaSoccorsoAereo>();

            #endregion AFM

            #region STATRI

            container.Register<ISendNewItemSTATRI, SendNewItem>();
            container.Register<IUpDateExistingItem, UpDateExistingItem>();
            container.Register<IMapperSintesiInSchedeSO115, MapperSintesiRichiestaSuSTATRI>();

            #endregion STATRI

            #region ESRI

            container.Register<INotify_ESRIAddRichiesta, SendNewRichiestaAssistena>();
            container.Register<IGetToken_ESRI, GetToken_ESRI>();

            #endregion ESRI
        }
    }
}
