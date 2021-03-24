﻿using System;

namespace SO115App.Models.Classi.ServiziEsterni.Oracle
{
    public class ORAPartenze
    {
        /// <summary>
        ///   CAMPO INTERVENTO DELLA TABELLA PARTENZE
        /// </summary>
        public decimal INTERVENTO { get; set; }

        /// <summary>
        ///   CAMPO DATA_INTERVENTO DELLA TABELLA PARTENZE
        /// </summary>
        public DateTime DATA_INTERVENTO { get; set; }

        /// <summary>
        ///   /// CAMPO COD_AUTOMEZZO DELLA TABELLA PARTENZE ///
        /// </summary>
        public decimal COD_AUTOMEZZO { get; set; }

        /// <summary>
        ///   /// CAMPO COD_SQUADRA DELLA TABELLA PARTENZE ///
        /// </summary>
        public decimal COD_SQUADRA { get; set; }

        /// <summary>
        ///   /// CAMPO TURNO DELLA TABELLA PARTENZE ///
        /// </summary>
        public String TURNO { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_SERVIZIO DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime DATA_SERVIZIO { get; set; }

        /// <summary>
        ///   /// CAMPO ORA_ASSEGNAZIONE DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ORA_ASSEGNAZIONE { get; set; }

        /// <summary>
        ///   /// CAMPO ORA_USCITA DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ORA_USCITA { get; set; }

        /// <summary>
        ///   /// CAMPO ORA_ARRIVO DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ORA_ARRIVO { get; set; }

        /// <summary>
        ///   /// CAMPO ORA_PARTENZA_LUOGO DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ORA_PARTENZA_LUOGO { get; set; }

        /// <summary>
        ///   /// CAMPO ORA_RIENTRO DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ORA_RIENTRO { get; set; }

        /// <summary>
        ///   /// CAMPO RIMPIAZZO DELLA TABELLA PARTENZE ///
        /// </summary>
        public string RIMPIAZZO { get; set; }

        /// <summary>
        ///   /// CAMPO PROV_ALTRO_INT DELLA TABELLA PARTENZE ///
        /// </summary>
        public string PROV_ALTRO_INT { get; set; }

        /// <summary>
        ///   /// CAMPO FLAG_SESSIONE DELLA TABELLA PARTENZE ///
        /// </summary>

        public decimal? FLAG_SESSIONE { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_ASSEGNAZIONE DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime DATA_ASSEGNAZIONE { get; set; }

        /// <summary>
        ///   /// CAMPO CONFERMATA DELLA TABELLA PARTENZE ///
        /// </summary>
        public string CONFERMATA { get; set; }

        /// <summary>
        ///   /// CAMPO CAPO_PARTENZA DELLA TABELLA PARTENZE ///
        /// </summary>
        public string CAPO_PARTENZA { get; set; }

        /// <summary>
        ///   /// CAMPO AUTISTA DELLA TABELLA PARTENZE ///
        /// </summary>
        public string AUTISTA { get; set; }

        /// <summary>
        ///   /// CAMPO ID_PARTENZA DELLA TABELLA PARTENZE ///
        /// </summary>
        public decimal ID_PARTENZA { get; set; }

        /// <summary>
        ///   /// CAMPO SCHEDA DELLA TABELLA PARTENZE ///
        /// </summary>
        public decimal SCHEDA { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_ULT_AGG DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime DATA_ULT_AGG { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_ULT_AGG DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime? DATA_PARTENZA_LUOGO { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_SOSTITUZIONE DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime? DATA_SOSTITUZIONE { get; set; }

        /// <summary>
        ///   /// CAMPO DATA_INS DELLA TABELLA PARTENZE ///
        /// </summary>
        public DateTime? DATA_INS { get; set; }

        /// <summary>
        ///   /// CAMPO TERMINALE DELLA TABELLA PARTENZE ///
        /// </summary>
        public string TERMINALE { get; set; }

        ///// <summary>
        /////   /// CAMPO TRIGGER_OFF DELLA TABELLA PARTENZE ///
        ///// </summary>
        //public string TRIGGER_OFF { get; set; }

        /// <summary>
        ///   /// CAMPO FLAG_ANNULLA DELLA TABELLA PARTENZE ///
        /// </summary>
        public string FLAG_ANNULLA { get; set; }

        ///// <summary>
        /////   /// CAMPO FLAG_AUTOMEZZI DELLA TABELLA PARTENZE ///
        ///// </summary>
        //public string FLAG_AUTOMEZZI { get; set; }

        /// <summary>
        ///   /// CAMPO ID_PARTENZE_INIZIALI DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ID_PARTENZE_INIZIALI { get; set; }

        /// <summary>
        ///   /// CAMPO ID_PARTENZE_INTERMEDIE DELLA TABELLA PARTENZE ///
        /// </summary>
        public string ID_PARTENZE_INTERMEDIE { get; set; }

        /// <summary>
        ///   /// CAMPO ID_SOSTITUZIONE DELLA TABELLA PARTENZE ///
        /// </summary>
        public decimal? ID_SOSTITUZIONE { get; set; }
    }
}
