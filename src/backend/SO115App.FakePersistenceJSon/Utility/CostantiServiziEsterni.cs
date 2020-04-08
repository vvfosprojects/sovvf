using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.FakePersistence.JSon.Utility
{
    public static class CostantiServiziEsterni
    {
        #region URLs External Services

        #region Controllers

        public static string URLNueController = "http://localhost:5001/api/SchedaContatto/";
        public static string GeoFleetUrl = "http://geofleet-ws/api/";
        public static string GacUrl = "http://localhost:5002/api/AnagraficaMezzi/";

        #endregion Controllers

        #region Methods

        public static string NueGetSchedaContattoAttuale = URLNueController + "SchedaContattoAttuale";
        public static string NueGetByCFe = URLNueController + "GetByCF";
        public static string NueGetByArea = URLNueController + "GetByArea";
        public static string NueGetByText = URLNueController + "GetByText";
        public static string NueGetByTipo = URLNueController + "GetByTipo";
        public static string NueGetByCodiceSede = URLNueController + "GetByCodiceSede";
        public static string NueGetLette = URLNueController + "GetLette";
        public static string NueGetGestite = URLNueController + "GetGestite";
        public static string NueGetByTimeSpan = URLNueController + "GetByTimeSpan";
        public static string NueSetLetta = URLNueController + "SetLetta";
        public static string NueSetGestita = URLNueController + "SetGestita";

        public static string GeoFleetGetPosizioneByCodiceMezzo = GeoFleetUrl + "posizioneByCodiceMezzo";
        public static string GeoFleetGetProssimita = GeoFleetUrl + "prossimita";
        public static string GeoFleetGetInRettangolo = GeoFleetUrl + "inRettangolo";

        public static string GacGetMezziUtilizzabili = GacUrl + "MezziUtilizzabili";
        public static string GacGetMezziFuoriServizio = GacUrl + "MezziFuoriServizio";
        public static string GacGetID = GacUrl + "ID";
        public static string GacGetICCID = GacUrl + "ICCID";
        public static string GacGetSELETTIVA = GacUrl + "SELETTIVA";
        public static string GacPutMovimentazione = GacUrl + "Movimentazione";

        #endregion Methods

        #endregion URLs External Services
    }
}
