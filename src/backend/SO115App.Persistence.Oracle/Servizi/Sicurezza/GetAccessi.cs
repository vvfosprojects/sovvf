using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;

namespace SO115App.Persistence.Oracle.Servizi.Sicurezza
{
    public class GetAccessi
    {
        public List<ORAListaMachine> GetListaMacchine(string CodSede)
        {
            List<ORAListaMachine> ListaMachine = new List<ORAListaMachine>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);
            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "select   NVL(MACHINE , '')  AS   MACHINE, " +
                               "NVL(USERNAME, '')  AS USERNAME, " +
                               " NVL(TERMINAL, '')  AS TERMINAL," +
                               "NVL(MODULE, '')  AS MODULE," +
                               "NVL(ACTION, '')  AS ACTION " +
                              "  from SALAOPER.LISTA_MACHINE";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAListaMachine lm = new ORAListaMachine();
                lm.MACHINE = Utility.Utility.GetDBField(dr, "MACHINE");
                lm.USERNAME = Utility.Utility.GetDBField(dr, "USERNAME");
                lm.TERMINAL = Utility.Utility.GetDBField(dr, "TERMINAL");
                lm.MODULE = Utility.Utility.GetDBField(dr, "MODULE");
                lm.ACTION = Utility.Utility.GetDBField(dr, "ACTION");
                ListaMachine.Add(lm);
            }

            conn.Dispose();
            return ListaMachine;
        }

        public List<ORAAccessiOperatori> GetListaAccessiOperatori(string CodSede)
        {
            List<ORAAccessiOperatori> ListaAccessiOperatori = new List<ORAAccessiOperatori>();
            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();

            cmd.Connection = conn;
            cmd.CommandText = "select NVL(MATRICOLA , '')  AS   MATRICOLA , " +
                              " NVL(LIVELLO, 0)  AS LIVELLO " +
                            " from SALAOPER.ACCESSI_OPERATORI";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAAccessiOperatori accessoOperatore = new ORAAccessiOperatori();
                accessoOperatore.MATRICOLA = SO115App.Persistence.Oracle.Utility.Utility.GetDBField(dr, "MATRICOLA");
                accessoOperatore.LIVELLO = SO115App.Persistence.Oracle.Utility.Utility.GetDBField(dr, "LIVELLO");
                ListaAccessiOperatori.Add(accessoOperatore);
            }

            conn.Dispose();
            return ListaAccessiOperatori;
        }

        public List<ORAAccessi> GetListaAccessi(string CodSede)
        {
            List<ORAAccessi> ListaAccessi = new List<ORAAccessi>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);
            OracleCommand cmd = new OracleCommand();
            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();

            cmd.Connection = conn;
            cmd.CommandText = "select  NVL(LIVELLO , 0)  AS   LIVELLO , " +
                            " NVL(TIPO_LIVELLO, '')  AS TIPO_LIVELLO, " +
                            " NVL(MAIN_MODULE, 0)  AS MAIN_MODULE, " +
                            " NVL(FLAG_CARTO, '')  AS FLAG_CARTO " +
                            " from SALAOPER.ACCESSI";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAAccessi accesso = new ORAAccessi();
                accesso.LIVELLO = Utility.Utility.GetDBField(dr, "LIVELLO");
                accesso.TIPO_LIVELLO = Utility.Utility.GetDBField(dr, "TIPO_LIVELLO");
                accesso.MAIN_MODULE = Utility.Utility.GetDBField(dr, "MAIN_MODULE");
                accesso.FLAG_CARTO = Utility.Utility.GetDBField(dr, "FLAG_CARTO");
                ListaAccessi.Add(accesso);
            }

            conn.Dispose();
            return ListaAccessi;
        }
    }
}
