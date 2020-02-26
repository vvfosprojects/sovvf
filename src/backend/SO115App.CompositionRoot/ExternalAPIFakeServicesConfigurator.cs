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
using Microsoft.Extensions.Caching.Memory;
using SimpleInjector;
using SO115App.ExternalAPI.Fake.Nue;
using SO115App.ExternalAPI.Fake.Personale;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.ExternalAPI.Fake.Servizi.GeoFleet;
using SO115App.ExternalAPI.Fake.Servizi.Identity;
using SO115App.ExternalAPI.Fake.Territorio;
using SO115App.ExternalAPI.Fake.Uos;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.IdentityManagement;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.ServizioSede;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System;
using System.Net.Http;

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

            #region NUE

            container.Register<IGetSchedeContatto, SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto.GetSchedeContatto>();
            container.Register<IGetSchedaContattoAttuale, GetSchedaContattoAttuale>();
            container.Register<IGetSchedeContattoBySpatialArea, GetSchedeContattoBySpatialArea>();
            container.Register<IGetSchedeContattoByCodiciFiscali, GetSchedeContattoByCodiciFiscali>();
            container.Register<IGetSchedeContattoByTipo, GetSchedeContattoByListTipo>();
            container.Register<IGetSchedeContattoByText, GetSchedeContattoByText>();
            container.Register<IGetSchedeContattoGestita, GetSchedeContattoGestita>();
            container.Register<IGetSchedeContattoTimeSpan, GetSchedeContattoTimeSpan>();
            container.Register<ISetStatoGestioneSchedaContatto, SetGestita>();
            container.Register<IGetSchedeContattoMarkerFiltered, SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto.GetSchedeContattoMarkerFiltered>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetConteggioSchede,
                SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto.GetConteggioSchedeContatto>();
            container.Register<SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue.IGetSchedeFiltrate,
                SO115App.ExternalAPI.Fake.ImportOracle.SchedeContatto.GetSchedeContattoFiltrate>();

            #endregion NUE

            #region Territorio

            container.Register<IGetAlberaturaISTAT, GetListaAlberaturaRegioni>();

            #endregion Territorio

            #region Personale

            container.Register<IGetSquadreBySede, GetSquadreBySede>();
            container.Register<IGetPersonaFisica, GetPersonaFisica>();
            container.Register<IGetSquadreNelTurno, GetSquadreNelTurno>();
            container.Register<IGetPersonaleVVF, ExternalAPI.Fake.ImportOracle.GestioniUtenti.GetPersonaleVVF>();
            container.Register<IGetPersonaleByCF, ExternalAPI.Fake.ImportOracle.GestioniUtenti.GetPersonaleByCF>();

            #endregion Personale

            #region GeoFleet

            container.Register<IGetInRettangolo, GetInRettangolo>();
            container.Register<IGetProssimita, GetProssimita>();
            container.Register<IGetPosizioneByCodiceMezzo, GetPosizioneByCodiceMezzo>();

            #endregion GeoFleet

            #region Gac

            container.Register<IGetMezziByICCID, GetMezziByICCID>();
            //container.Register<IGetMezziByCodiceMezzo, GetMezziByCodiceMezzo>();
            container.Register<IGetMezziByCodiceMezzo, SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetMezziByCodiceMezzo>();
            container.Register<IGetMezziBySelettiva, GetMezziBySelettiva>();
            container.Register<IGetMezziFuoriServizio, GetMezziFuoriServizio>();
            //container.Register<IGetMezziUtilizzabili, GetMezziUtilizzabili>();
            container.Register<IGetMezziUtilizzabili, SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetMezziUtilizzabili>();
            container.Register<ISetMovimentazione, SetMovimentazione>();
            container.Register<
                SO115App.API.Models.Servizi.Infrastruttura.GestioneSoccorso.Mezzi.IGetListaMezzi,
                ExternalAPI.Fake.GestioneMezzi.GetListaMezziExt>(); //TODO gestione composition Root per l'externalAPI

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateConfermaPartenze,
                ExternalAPI.Fake.Composizione.UpdateConfermaPartenzeExt>(); //TODO gestione composition Root per l'externalAPI
            container.Register<
                 SO115App.Models.Servizi.Infrastruttura.Composizione.IUpdateStatoPartenze,
                ExternalAPI.Fake.Composizione.UpdateStatoPartenzaExt>(); //TODO gestione composition Root per l'externalAPI
            container.Register<
               SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi.IGetComposizioneMezzi,
               SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetComposizioneMezzi>();
            //container.Register<
            //    SO115App.Models.Servizi.Infrastruttura.GetComposizioneMezzi.IGetComposizioneMezzi,
            //    ExternalAPI.Fake.Composizione.GetComposizioneMezziExt>();//TODO gestione composition Root per l'externalAPI

            #endregion Gac

            #region Sedi

            container.Register<IGetAlberaturaUnitaOperative, GetListaSediAlberata>();

            #endregion Sedi

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Box.IGetBoxMezzi,
                ExternalAPI.Fake.Box.GetBoxMezziExt>();//TODO gestione composition Root per l'externalAPI
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Box.IGetBoxPersonale,
                ExternalAPI.Fake.Box.GetBoxPersonaleExt>();//TODO gestione composition Root per l'externalAPI
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.Marker.IGetMezziMarker,
                ExternalAPI.Fake.Marker.GetMezziMarkerExt>();

            #region Mezzi

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi.IGetListaMezzi,
                SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetListaMezzi>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Mezzi.IGetMezzoById,
                SO115App.ExternalAPI.Fake.ImportOracle.MezziMapper.GetMezzoById>();

            #endregion Mezzi

            #region Squadre

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetListaSquadre,
                SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper.GetListaSquadre>();
            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Squadre.IGetSquadraById,
                SO115App.ExternalAPI.Fake.ImportOracle.SquadreMapper.GetSquadraById>();

            #endregion Squadre

            #region GesPreaccoppiati

            container.Register<
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.GesPreaccoppiati.IGetListaGesPreaccoppiati,
                SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper.GetListaGesPreaccoppiati>();

            container.Register<
            SO115App.Models.Servizi.Infrastruttura.GetPreAccoppiati.IGetPreAccoppiati,
          SO115App.ExternalAPI.Fake.ImportOracle.GesPreaccoppiatiMapper.GetPreAccoppiati>();

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
                SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Distaccamenti.IGetListaDistaccamentiByCodiceSede,
                SO115App.ExternalAPI.Fake.ImportOracle.DistaccamentiMapper.GetDistaccamentiByCodSede>();

            #endregion Distaccamenti

            #region Tipologie

            container.Register<Models.Servizi.Infrastruttura.SistemiEsterni.Tipologie.IGetListaTipologie, ExternalAPI.Fake.ImportOracle.TipologieMapper.GetTipologie>();

            #endregion Tipologie
        }
    }
}
