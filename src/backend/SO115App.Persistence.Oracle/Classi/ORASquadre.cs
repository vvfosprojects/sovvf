using System;

namespace SO115App.Persistence.Oracle.Classi
{
   public class ORASquadre
    {
        public ORASquadre()
        {
        }


        //       COD_SQUADRA NOT NULL NUMBER(4)
        //SIGLA NOT NULL VARCHAR2(50)
        //COD_DISTACCAMENTO NOT NULL NUMBER(4)
        //COL_MOB NOT NULL VARCHAR2(1)
        //PRIORITA_COMANDO NUMBER(2)
        //PRIORITA_DISTACCAMENTO NUMBER(2)
        //SQUADRE_MANSIONE VARCHAR2(1)
       
            //STAMPA VARCHAR2(1)
        


        /// <summary>
        ///   CAMPO COD_SQUADRA DELLA TABELLA SQUADRE
        /// </summary>
        public decimal COD_SQUADRA { get; set; }

        /// <summary>
        ///   CAMPO SIGLA DELLA TABELLA SQUADRE
        /// </summary>
        public string SIGLA { get; set; }


        /// <summary>
        ///   CAMPO COD_DISTACCAMENTO DELLA TABELLA SQUADRE
        /// </summary>
        public decimal COD_DISTACCAMENTO { get; set; }

        /// <summary>
        ///   CAMPO COL_MOB DELLA TABELLA SQUADRE
        /// </summary>
        public string COL_MOB { get; set; }


        /// <summary>
        ///   CAMPO PRIORITA_COMANDO DELLA TABELLA SQUADRE
        /// </summary>
        public decimal? PRIORITA_COMANDO { get; set; }

        /// <summary>
        ///   CAMPO PRIORITA_DISTACCAMENTO DELLA TABELLA SQUADRE
        /// </summary>
        public decimal? PRIORITA_DISTACCAMENTO { get; set; }


        /// <summary>
        ///   CAMPO SQUADRE_MANSIONE DELLA TABELLA SQUADRE
        /// </summary>
        public string SQUADRE_MANSIONE { get; set; }

        /// <summary>
        ///   CAMPO STAMPA DELLA TABELLA SQUADRE
        /// </summary>
        public string STAMPA { get; set; }

        
        /// <summary>
        ///   CAMPO SQUADRE_EMERGENZA DELLA TABELLA SQUADRE
        /// </summary>
        public string SQUADRE_EMERGENZA { get; set; }

        /// <summary>
        ///   CAMPO NUMERO_PERSONE DELLA TABELLA SQUADRE
        /// </summary>
        public decimal? NUMERO_PERSONE { get; set; }


        /// <summary>
        ///   CAMPO VISUALIZZA DELLA TABELLA SQUADRE
        /// </summary>
        public string VISUALIZZA { get; set; }

        /// <summary>
        ///   CAMPO CONTEGGIO_MENSA DELLA TABELLA SQUADRE
        /// </summary>
        public string CONTEGGIO_MENSA { get; set; }


        // <summary>
        ///   CAMPO SUPPORTO DELLA TABELLA SQUADRE
        /// </summary>
        public string SUPPORTO { get; set; }



    }
}
