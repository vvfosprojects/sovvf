using System;

namespace SO115App.Persistence.Oracle.Core.Classi
{
    public class ORASQPersonaleSquadre
    {
        /// <SUMMARY>CAMPO COD_SQUADRA DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public decimal COD_SQUADRA { get; set; }

        //// <SUMMARY>
        ///   CAMPO TURNO DELLA TABELLA SQ_PERSONALE_SQUADRE
        /// </SUMMARY>
        public string TURNO { get; set; }

        //// <SUMMARY>
        ///   CAMPO DATA_SERVIZIO DELLA TABELLA SQ_PERSONALE_SQUADRE
        /// </SUMMARY>
        public DateTime DATA_SERVIZIO { get; set; }

        //// <SUMMARY>
        ///   CAMPO STATO DELLA TABELLA SQ_PERSONALE_SQUADRE
        /// </SUMMARY>
        public string STATO { get; set; }

        //// <SUMMARY>
        ///   CAMPO SIGLA DELLA TABELLA SQ_PERSONALE_SQUADRE
        /// </SUMMARY>
        public string SIGLA { get; set; }

        //// <SUMMARY>
        ///   CAMPO COD_DISTACCAMENTO DELLA TABELLA SQ_PERSONALE_SQUADRE
        /// </SUMMARY>
        public decimal COD_DISTACCAMENTO { get; set; }

        /// <SUMMARY>CAMPO SQUADRA_EMERGENZA DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public string SQUADRA_EMERGENZA { get; set; }

        /// <SUMMARY>CAMPO VISUALIZZA DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public string VISUALIZZA { get; set; }
    }
}
