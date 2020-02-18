using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;
using System;

namespace SO115App.Persistence.Oracle.Servizi.Competenze
{
    public class GetTipologie
    {
        public List<ORAGruppo_Tipologie> GetListaGruppoTipologie(string CodSede)
        {
            List<ORAGruppo_Tipologie> ListaGruppoTipologie = new List<ORAGruppo_Tipologie>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT NVL(COD_GRUPPO,0) as COD_GRUPPO, DESC_GRUPPO, NVL(PRIORITA_GRUPPO,0) as PRIORITA_GRUPPO" +
                              " FROM SALAOPER.GRUPPO_TIPOLOGIE";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAGruppo_Tipologie ORAgt = new ORAGruppo_Tipologie();
                ORAgt.COD_GRUPPO = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_GRUPPO"));
                ORAgt.DESC_GRUPPO = Utility.Utility.GetDBField(dr, "DESC_GRUPPO");
                ORAgt.PRIORITA_GRUPPO = Utility.Utility.GetDBField(dr, "PRIORITA_GRUPPO");

                ListaGruppoTipologie.Add(ORAgt);
            }

            conn.Dispose();
            return ListaGruppoTipologie;
        }

        public List<ORATipologie> GetListaTipologie(string CodSede)
        {
            List<ORATipologie> ListaGruppoTipologie = new List<ORATipologie>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT NVL(COD_TIPOLOGIA,0) as COD_TIPOLOGIA, DESCRIZIONE, NVL(COD_GRUPPO,0) as COD_GRUPPO, NVL(COD_PRIORITA,0) as COD_PRIORITA, OBSOLETO, NVL(COD_UTILITA_SOCCORSO_AEREO,0) as COD_UTILITA_SOCCORSO_AEREO" +
                              " FROM SALAOPER.TIPOLOGIE ";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORATipologie ORATip = new ORATipologie();

                ORATip.COD_TIPOLOGIA = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_TIPOLOGIA"));
                ORATip.DESCRIZIONE = Utility.Utility.GetDBField(dr, "DESCRIZIONE");
                ORATip.COD_GRUPPO = Convert.ToInt32(Utility.Utility.GetDBField(dr, "COD_GRUPPO"));
                ORATip.COD_PRIORITA = Utility.Utility.GetDBField(dr, "COD_PRIORITA");
                ORATip.OBSOLETO = Utility.Utility.GetDBField(dr, "OBSOLETO");
                ORATip.COD_UTILITA_SOCCORSO_AEREO = Utility.Utility.GetDBField(dr, "COD_UTILITA_SOCCORSO_AEREO");

                ListaGruppoTipologie.Add(ORATip);
            }

            conn.Dispose();
            return ListaGruppoTipologie;
        }
    }
}
