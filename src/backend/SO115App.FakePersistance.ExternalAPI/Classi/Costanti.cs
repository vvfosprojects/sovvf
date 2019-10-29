//-----------------------------------------------------------------------
// <copyright file="Costanti.cs" company="CNVVF">
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
namespace SO115App.ExternalAPI.Fake
{
    public class Costanti
    {
        #region Url

        public static string TerritorioUrl = "http://172.16.25.10:5002/swagger/";

        public static string ServiziUrl = "http://172.16.15.34:5000/api/";

        public static string IdentityManagementUrl = "http://172.16.25.10:5000/api/RicercaPerElencoCodiciFiscali";

        public static string NueUrl = "http://localhost:5001/api/SchedaContatto/";
        public static string GeoFleetUrl = "http://geofleet-ws/api/";
        public static string GacUrl = "http://localhost:5002/api/AnagraficaMezzi/";

        public static string UosUrl = "http://172.16.25.10:5001/api/";

        #endregion Url

        #region NueMethods

        public static string NueGetSchedaContattoAttuale = NueUrl + "SchedaContattoAttuale";
        public static string NueGetSchedaContatto = NueUrl + "SchedaContatto";
        public static string NueGetByCFe = NueUrl + "GetByCF";
        public static string NueGetByArea = NueUrl + "GetByArea";
        public static string NueGetByText = NueUrl + "GetByText";
        public static string NueGetByTipo = NueUrl + "GetByTipo";
        public static string NueGetByCodiceSede = NueUrl + "GetByCodiceSede";
        public static string NueGetLette = NueUrl + "GetLette";
        public static string NueGetGestite = NueUrl + "GetGestite";
        public static string NueGetByTimeSpan = NueUrl + "GetByTimeSpan";
        public static string NueSetLetta = NueUrl + "SetLetta";
        public static string NueSetGestita = NueUrl + "SetGestita";

        #endregion NueMethods

        #region GeoFleetMethods

        public static string GeoFleetGetPosizioneByCodiceMezzo = GeoFleetUrl + "posizioneByCodiceMezzo";
        public static string GeoFleetGetProssimita = GeoFleetUrl + "prossimita";
        public static string GeoFleetGetInRettangolo = GeoFleetUrl + "inRettangolo";

        #endregion GeoFleetMethods

        #region GacMethods

        public static string GacGetMezziUtilizzabili = GacUrl + "MezziUtilizzabili";
        public static string GacGetMezziFuoriServizio = GacUrl + "MezziFuoriServizio";
        public static string GacGetID = GacUrl + "ID";
        public static string GacGetICCID = GacUrl + "ICCID";
        public static string GacGetSELETTIVA = GacUrl + "SELETTIVA";
        public static string GacPutMovimentazione = GacUrl + "Movimentazione";

        #endregion GacMethods

        #region TerritorioMethods

        public static string TerritorioGetRegioniUrl = "Regioni?startIndex=0&pageSize=900";
        public static string TerritorioGetProvinceUrl = "Province?startIndex=0&pageSize=900";
        public static string TerritorioGetComuniUrl = "Comuni?startIndex=0&pageSize=12000";

        #endregion TerritorioMethods

        #region ServiziMethods

        public static string ServiziGetSquadreUrl = ServiziUrl + "Squadre";
        public static string ServiziGetComponentiUrl = ServiziUrl + "Componenti";

        #endregion ServiziMethods

        #region Uos

        public static string UosUOUrl = "UO";
        public static string UosSediUrl = "Sedi";
        public static string UosAssUrl = "AssociazioneUOSedi";

        #endregion Uos
    }
}
