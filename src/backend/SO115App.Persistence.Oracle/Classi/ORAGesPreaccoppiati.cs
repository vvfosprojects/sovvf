using System;

namespace SO115App.Persistence.Oracle.Classi
{
   public class ORAGesPreaccoppiati
    {
        public ORAGesPreaccoppiati()
        {
        }



        /// <summary>
        ///   CAMPO COD_SQUADRA DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public decimal COD_SQUADRA { get; set; }

        /// <summary>
        ///   CAMPO COD_AUTOMEZZO DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public decimal COD_AUTOMEZZO { get; set; }

        /// <summary>
        ///   CAMPO CMOB_PARTENZA DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public string CMOB_PARTENZA { get; set; }


    }
}
