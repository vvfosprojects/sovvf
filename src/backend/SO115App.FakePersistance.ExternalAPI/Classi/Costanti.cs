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

namespace SO115App.ExternalAPI.Fake.Classi
{
    public static class Costanti
    {
        #region Url

        public static string TerritorioUrl = "http://172.16.25.10:5002/swagger/";

        public static string ServiziUrl = "http://172.16.15.34:5000/api/";

        public static string IdentityManagementUrl = "http://172.16.25.10:5000/api/RicercaPerElencoCodiciFiscali";

        public static string NueUrl = "http://localhost:5001/api/SchedaContatto/";
        public static string GeoFleetUrl = "http://geofleet-ws.dipvvf.it/api/";
        public static string GacUrl = "http://localhost:5002/api/AnagraficaMezzi/";

        public static string UosUrl = "http://172.16.25.10:5001/api/";

        #endregion Url

        #region Json

        public static string GacJson = "Servizi/Gac/Mock/Json/Mezzo.json";
        public static string NueJson = "Servizi/Nue/Mock/Json/SchedeContatto.json";
        public static string ServiziComponentiJson = "Servizi/Personale/Mock/Json/Componenti.json";
        public static string IdentityManagementJson = "Servizi/Identity/Mock/Json/Anagrafica.json";
        public static string ServiziSquadreJson = "Servizi/Personale/Mock/Json/SquadreNelTurno.json";

        #endregion Json

        #region NueMethods

        public static string NueGetSchedaContattoAttuale = "SchedaContattoAttuale";
        public static string NueGetSchedaContatto = "SchedaContatto";
        public static string NueGetByCFe = "GetByCF";
        public static string NueGetByArea = "GetByArea";
        public static string NueGetByText = "GetByText";
        public static string NueGetByTipo = "GetByTipo";
        public static string NueGetByCodiceSede = "GetByCodiceSede";
        public static string NueGetLette = "GetLette";
        public static string NueGetGestite = "GetGestite";
        public static string NueGetByTimeSpan = "GetByTimeSpan";
        public static string NueSetLetta = "SetLetta";
        public static string NueSetGestita = "SetGestita";

        #endregion NueMethods

        #region GeoFleetMethods

        public static string GeoFleetGetPosizioneByCodiceMezzo = "posizioneByCodiceMezzo/";
        public static string GeoFleetGetProssimita = "prossimita/";
        public static string GeoFleetGetInRettangolo = "inRettangolo/";

        #endregion GeoFleetMethods

        #region GacMethods

        public static string GacGetMezziUtilizzabili = "MezziUtilizzabili";
        public static string GacGetMezziFuoriServizio = "MezziFuoriServizio";
        public static string GacGetID = "ID";
        public static string GacGetICCID = "ICCID";
        public static string GacGetSELETTIVA = "SELETTIVA";
        public static string GacPutMovimentazione = "Movimentazione";

        #endregion GacMethods

        #region TerritorioMethods

        public static string TerritorioGetRegioniUrl = "Regioni?startIndex=0&pageSize=900";
        public static string TerritorioGetProvinceUrl = "Province?startIndex=0&pageSize=900";
        public static string TerritorioGetComuniUrl = "Comuni?startIndex=0&pageSize=12000";

        #endregion TerritorioMethods

        #region ServiziMethods

        public static string ServiziGetSquadreUrl = "Squadre";
        public static string ServiziGetComponentiUrl = "Componenti";

        #endregion ServiziMethods

        #region Uos

        public static string UosUOUrl = "UO";
        public static string UosSediUrl = "Sedi";
        public static string UosAssUrl = "AssociazioneUOSedi";

        #endregion Uos
    }
}
