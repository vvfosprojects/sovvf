﻿using System;

namespace SO115App.Models.Classi.ServiziEsterni.Oracle
{
    public class ORAGruppo_Tipologie
    {
        public ORAGruppo_Tipologie()
        {
        }

        /// <summary>
        ///   CAMPO COD_GRUPPO DELLA TABELLA GRUPPO_TIPOLOGIE
        /// </summary>
        public decimal COD_GRUPPO { get; set; }

        /// <summary>
        ///   CAMPO DESC_GRUPPO DELLA TABELLA GRUPPO_TIPOLOGIE
        /// </summary>
        public string DESC_GRUPPO { get; set; }

        /// <summary>
        ///   CAMPO PRIORITA_GRUPPO DELLA TABELLA GRUPPO_TIPOLOGIE
        /// </summary>
        public decimal PRIORITA_GRUPPO { get; set; }
    }
}
