using System;


    
namespace SO115App.Persistence.Oracle.Classi
{
   public class ORATipologie
    {

 
        public ORATipologie()
        {
        }


        /// <summary>
        ///   CAMPO COD_TIPOLOGIA DELLA TABELLA TIPOLOGIE
        /// </summary>
        public decimal COD_TIPOLOGIA { get; set; }


        /// <summary>
        ///   CAMPO DESCRIZIONE DELLA TABELLA TIPOLOGIE
        /// </summary>
        public string DESCRIZIONE { get; set; }
        /// <summary>
        ///   CAMPO COD_GRUPPO DELLA TABELLA TIPOLOGIE
        /// </summary>
        public decimal COD_GRUPPO { get; set; }
        
        /// <summary>
        ///   CAMPO COD_PRIORITA DELLA TABELLA TIPOLOGIE
        /// </summary>
        public decimal COD_PRIORITA { get; set; }

         
        /// <summary>
        ///   CAMPO OBSOLETO DELLA TABELLA TIPOLOGIE
        /// </summary>
        public string OBSOLETO { get; set; }
        /// <summary>
        ///   CAMPO COD_UTILITA_SOCCORSO_AEREO DELLA TABELLA TIPOLOGIE
        /// </summary>
        public decimal COD_UTILITA_SOCCORSO_AEREO { get; set; }



    }
}
