using System;

namespace SO115App.Persistence.Oracle.Classi
{
    public class ORAAccessi
    {
        /// <SUMMARY>CAMPO LIVELLO DELLA TABELLA ACCESSI</SUMMARY>
        public int LIVELLO { get; set; }

        /// <SUMMARY>CAMPO TIPO_LIVELLO DELLA TABELLA ACCESSI</SUMMARY>
        public string TIPO_LIVELLO { get; set; }

        /// <SUMMARY>CAMPO MAIN_MODULE DELLA TABELLA ACCESSI</SUMMARY>
        public string MAIN_MODULE { get; set; }

        /// <SUMMARY>CAMPO FLAG_CARTO DELLA TABELLA ACCESSI</SUMMARY>
        public string FLAG_CARTO { get; set; }
    }
}
