using System;

namespace SO115App.ExternalAPI.Fake.Classi.DTOOracle
{
    public class ORAPersonaleSquadre
    {
        /// <SUMMARY>CAMPO COD_SQUADRA DELLA TABELLA PERSONALE_SQUADRE</SUMMARY>
        public decimal COD_SQUADRA { get; set; }

        //// <SUMMARY>CAMPO MATDIP DELLA TABELLA PERSONALE_SQUADRE</SUMMARY>
        public string MATDIP { get; set; }

        /// <SUMMARY>CAMPO FLAG_CAPO_SQUADRA DELLA TABELLA PERSONALE_SQUADRE</SUMMARY>
        public string FLAG_CAPO_SQUADRA { get; set; }

        //// <SUMMARY>CAMPO DATA_SERVIZIO DELLA TABELLA SPERSONALE_SQUADRE</SUMMARY>
        public DateTime DATA_SERVIZIO { get; set; }

        //// <SUMMARY>CAMPO TURNO DELLA TABELLA PERSONALE_SQUADRE</SUMMARY>
        public string TURNO { get; set; }

        //// <SUMMARY>CAMPO AUTISTA DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public string AUTISTA { get; set; }

        /// <SUMMARY>CAMPO QUALIFICA_ABBREV DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public string QUALIFICA_ABBREV { get; set; }

        //// <SUMMARY> CAMPO COD_DISTACCAMENTO DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public decimal COD_DISTACCAMENTO { get; set; }

        /// <SUMMARY>CAMPO PROGRESSIVO DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public decimal PROGRESSIVO { get; set; }

        //// <SUMMARY> CAMPO ORA_INIZIO DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public DateTime? ORA_INIZIO { get; set; }

        /// <SUMMARY>CAMPO ORA_FINE DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public DateTime? ORA_FINE { get; set; }

        //// <SUMMARY>CAMPO DATA_ULT_AGG DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public DateTime? DATA_ULT_AGG { get; set; }

        //// <SUMMARY>CAMPO ULTERIORI_AUTISTI DELLA TABELLA SQ_PERSONALE_SQUADRE</SUMMARY>
        public decimal ULTERIORI_AUTISTI { get; set; }
    }
}
