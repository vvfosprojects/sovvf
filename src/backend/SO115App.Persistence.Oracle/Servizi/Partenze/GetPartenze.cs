using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;
using System;

namespace SO115App.Persistence.Oracle.Servizi.Partenze
{
    public class GetPartenze
    {
        public List<ORAPartenze> GetListaPartenzeByCodIntervento(string CodSede, decimal CodIntervento)
        {
            var ListaPartene = new List<ORAPartenze>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            OracleCommand cmd = new OracleCommand();
            conn.Open();
            cmd.Connection = conn;

            cmd.CommandText = $"SELECT " +
                     "NVL( INTERVENTO               ,'') as	 INTERVENTO         ," +
                    "NVL( DATA_INTERVENTO          ,'') as	 DATA_INTERVENTO    ," +
                    "NVL( COD_AUTOMEZZO            ,'') as	 COD_AUTOMEZZO      ," +
                    "NVL( COD_SQUADRA              ,'') as	 COD_SQUADRA        ," +
                    "NVL( TURNO                    ,'') as	 TURNO              ," +
                    "NVL( DATA_SERVIZIO            ,'') as	 DATA_SERVIZIO      ," +
                    "NVL( ORA_ASSEGNAZIONE         ,'') as	 ORA_ASSEGNAZIONE    ," +
                    "NVL( ORA_USCITA               ,'') as	 ORA_USCITA         ," +
                    "NVL( ORA_ARRIVO               ,'') as	 ORA_ARRIVO         ," +
                    "NVL( ORA_PARTENZA_LUOGO       ,'') as	 ORA_PARTENZA_LUOGO  ," +
                    "NVL( ORA_RIENTRO              ,'') as	 ORA_RIENTRO        ," +
                    "NVL( RIMPIAZZO                ,'') as	 RIMPIAZZO          ," +
                    "NVL( PROV_ALTRO_INT           ,'') as	 PROV_ALTRO_INT     ," +
                    "NVL( FLAG_SESSIONE            ,'') as	 FLAG_SESSIONE      ," +
                    "NVL( DATA_ASSEGNAZIONE        ,'') as	 DATA_ASSEGNAZIONE  ," +
                    "NVL( CONFERMATA               ,'') as	 CONFERMATA         ," +
                    "NVL( CAPO_PARTENZA            ,'') as	 CAPO_PARTENZA      ," +
                    "NVL( AUTISTA                  ,'') as	 AUTISTA            ," +
                    "NVL( ID_PARTENZA              ,'') as	 ID_PARTENZA        ," +
                    "NVL( SCHEDA                   ,'') as	 SCHEDA             ," +
                    "NVL( DATA_ULT_AGG             ,'') as	 DATA_ULT_AGG       ," +
                    "NVL( DATA_PARTENZA_LUOGO      ,'') as	 DATA_PARTENZA_LUOGO ," +
                    "NVL( DATA_SOSTITUZIONE        ,'') as	 DATA_SOSTITUZIONE  ," +
                    "NVL( DATA_INS                 ,'') as	 DATA_INS           ," +
                    "NVL( TERMINALE                ,'') as	 TERMINALE          ," +
                    // "NVL(TRIGGER_OFF,'') as TRIGGER_OFF ," +
                    "NVL( FLAG_ANNULLA             ,'') as	 FLAG_ANNULLA       ," +
                    //"NVL( FLAG_AUTOMEZZI           ,'') as	 FLAG_AUTOMEZZI     ," +
                    "NVL( ID_PARTENZE_INIZIALI     ,'') as	 ID_PARTENZE_INIZIALI ," +
                    "NVL( ID_PARTENZE_INTERMEDIE   ,'') as	 ID_PARTENZE_INTERMEDIE ," +
                    "NVL( ID_SOSTITUZIONE          ,'') as	 ID_SOSTITUZIONE    " +
               " FROM SALAOPER.PARTENZE         WHERE INTERVENTO  =:INTERVENTO";

            cmd.CommandType = CommandType.Text;
            cmd.BindByName = true;
            cmd.Parameters.Add(new OracleParameter("INTERVENTO", OracleDbType.Decimal, CodIntervento, ParameterDirection.Input));

            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAPartenze ORAP = new ORAPartenze();
                ORAP.INTERVENTO = Utility.Utility.GetDBField(dr, "INTERVENTO");
                ORAP.DATA_INTERVENTO = Utility.Utility.GetDBField(dr, "DATA_INTERVENTO");
                ORAP.COD_AUTOMEZZO = Utility.Utility.GetDBField(dr, "COD_AUTOMEZZO");
                ORAP.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                ORAP.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORAP.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORAP.ORA_ASSEGNAZIONE = Utility.Utility.GetDBField(dr, "ORA_ASSEGNAZIONE");
                ORAP.ORA_USCITA = Utility.Utility.GetDBField(dr, "ORA_USCITA");
                ORAP.ORA_ARRIVO = Utility.Utility.GetDBField(dr, "ORA_ARRIVO");
                ORAP.ORA_PARTENZA_LUOGO = Utility.Utility.GetDBField(dr, "ORA_PARTENZA_LUOGO");
                ORAP.ORA_RIENTRO = Utility.Utility.GetDBField(dr, "ORA_RIENTRO");
                ORAP.RIMPIAZZO = Utility.Utility.GetDBField(dr, "RIMPIAZZO");
                ORAP.PROV_ALTRO_INT = Utility.Utility.GetDBField(dr, "PROV_ALTRO_INT");
                ORAP.FLAG_SESSIONE = Utility.Utility.GetDBField(dr, "FLAG_SESSIONE");
                ORAP.DATA_ASSEGNAZIONE = Utility.Utility.GetDBField(dr, "DATA_ASSEGNAZIONE");
                ORAP.CONFERMATA = Utility.Utility.GetDBField(dr, "CONFERMATA");
                ORAP.CAPO_PARTENZA = Utility.Utility.GetDBField(dr, "CAPO_PARTENZA");
                ORAP.AUTISTA = Utility.Utility.GetDBField(dr, "AUTISTA");
                ORAP.ID_PARTENZA = Utility.Utility.GetDBField(dr, "ID_PARTENZA");
                ORAP.SCHEDA = Utility.Utility.GetDBField(dr, "SCHEDA");
                ORAP.DATA_ULT_AGG = Utility.Utility.GetDBField(dr, "DATA_ULT_AGG");
                ORAP.DATA_PARTENZA_LUOGO = Utility.Utility.GetDBField(dr, "DATA_PARTENZA_LUOGO");
                ORAP.DATA_SOSTITUZIONE = Utility.Utility.GetDBField(dr, "DATA_SOSTITUZIONE");
                ORAP.DATA_INS = Utility.Utility.GetDBField(dr, "DATA_INS");
                ORAP.TERMINALE = Utility.Utility.GetDBField(dr, "TERMINALE");
                //ORAP.TRIGGER_OFF = Utility.Utility.GetDBField(dr, "TRIGGER_OFF");
                ORAP.FLAG_ANNULLA = Utility.Utility.GetDBField(dr, "FLAG_ANNULLA");
                //ORAP.FLAG_AUTOMEZZI = Utility.Utility.GetDBField(dr, "FLAG_AUTOMEZZI");
                ORAP.ID_PARTENZE_INIZIALI = Utility.Utility.GetDBField(dr, "ID_PARTENZE_INIZIALI");
                ORAP.ID_PARTENZE_INTERMEDIE = Utility.Utility.GetDBField(dr, "ID_PARTENZE_INTERMEDIE");
                ORAP.ID_SOSTITUZIONE = Utility.Utility.GetDBField(dr, "ID_SOSTITUZIONE");

                ListaPartene.Add(ORAP);
            }

            conn.Dispose();
            return ListaPartene;
        }
    }
}
