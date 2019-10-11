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
using SimpleInjector;
using SO115App.ExternalAPI.Fake.Nue;
using SO115App.ExternalAPI.Fake.Personale;
using SO115App.ExternalAPI.Fake.Servizi.Gac;
using SO115App.ExternalAPI.Fake.Servizi.GeoFleet;
using SO115App.ExternalAPI.Fake.Territorio;
using SO115App.Models.Servizi.Infrastruttura.GeoFleet;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Gac;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Nue;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Personale;
using SO115App.Models.Servizi.Infrastruttura.SistemiEsterni.Territorio;
using System.Net.Http;

namespace SO115App.CompositionRoot
{
    internal static class ExternalAPIFakeServicesConfigurator
    {
        internal static void Configure(Container container)
        {
            PersistenceServicesConfigurator.Configure(container);
            container.Register<HttpClient>(Lifestyle.Singleton);

            #region NUE

            container.Register<IGetSchedeContatto, GetListaSchedeContatto>();
            container.Register<IGetSchedaContattoAttuale, GetSchedaContattoAttuale>();
            container.Register<IGetSchedeContattoBySpatialArea, GetSchedeContattoBySpatialArea>();
            container.Register<IGetSchedeContattoByCodiceSede, GetSchedeContattoByCodiceSede>();
            container.Register<IGetSchedeContattoByCodiciFiscali, GetSchedeContattoByCodiciFiscali>();
            container.Register<IGetSchedeContattoByTipo, GetSchedeContattoByListTipo>();
            container.Register<IGetSchedeContattoByText, GetSchedeContattoByText>();
            container.Register<IGetSchedeContattoGestita, GetSchedeContattoGestita>();
            container.Register<IGetSchedeContattoLetta, GetSchedeContattoLetta>();
            container.Register<IGetSchedeContattoTimeSpan, GetSchedeContattoTimeSpan>();
            container.Register<ISetStatoGestioneSchedaContatto, SetGestita>();
            container.Register<ISetLetturaSchedaContatto, SetLetta>();

            #endregion NUE

            #region Territorio

            container.Register<IGetAlberaturaISTAT, GetListaAlberaturaRegioni>();

            #endregion Territorio

            #region Personale

            container.Register<IGetSquadreBySede, GetSquadreBySede>();

            container.Register<IGetSquadreNelTurno, GetSquadreNelTurno>();

            #endregion Personale

            #region GeoFleet

            container.Register<IGetInRettangolo, GetInRettangolo>();
            container.Register<IGetProssimita, GetProssimita>();
            container.Register<IGetPosizioneByCodiceMezzo, GetPosizioneByCodiceMezzo>();

            #endregion GeoFleet

            #region Gac

            container.Register<IGetMezziByICCID, GetMezziByICCID>();
            container.Register<IGetMezziById, GetMezziByID>();
            container.Register<IGetMezziBySelettiva, GetMezziBySelettiva>();
            container.Register<IGetMezziFuoriServizio, GetMezziFuoriServizio>();
            container.Register<IGetMezziUtilizzabili, GetMezziUtilizzabili>();
            container.Register<ISetMovimentazione, SetMovimentazione>();

            #endregion Gac
        }
    }
}
