using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;

namespace SO115App.Persistence.Oracle.Servizi.Sicurezza
{
    public class GetOperatori
    {
        public List<ORAOperatori> GetListaOperatori(string CodSede)
        {
            List<ORAOperatori> ListaOperatori = new List<ORAOperatori>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT   NVL(MATRICOLA, ' ') as MATRICOLA " +
                            ",NVL(PASSWORD, '')  AS PASSWORD " +
                            ", NVL(NOME, '')  AS NOME " +
                            ", NVL(COGNOME, '')  AS COGNOME " +
                            ", NVL(TURNO, '')  AS TURNO " +
                            " from SALAOPER.OPERATORI ";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAOperatori operatore = new ORAOperatori();
                operatore.MATRICOLA = Utility.Utility.GetDBField(dr, "MATRICOLA");
                operatore.PASSWORD = Utility.Utility.GetDBField(dr, "PASSWORD");
                operatore.NOME = Utility.Utility.GetDBField(dr, "NOME");
                operatore.COGNOME = Utility.Utility.GetDBField(dr, "COGNOME");
                operatore.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ListaOperatori.Add(operatore);
            }

            conn.Dispose();
            return ListaOperatori;
        }
    }
}
