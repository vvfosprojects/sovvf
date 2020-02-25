using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Servizi.Distaccamenti
{
    public class GetDistaccamentiByCodSede
    {
        public List<ORADistaccamenti> GetDistaccamentiBySede(string CodSede)
        {
            List<ORADistaccamenti> ListaDistaccamenti = new List<ORADistaccamenti>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT " +
                              "NVL(TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC,1000) as CODDISTAC, " +
                              "NVL(TABELLE_COMUNI.DISTACCAMENTI.DESCDISTAC,'') as DESCDISTAC, " +
                              "NVL(TABELLE_COMUNI.DISTACCAMENTI.CODSEDE,'') as CODSEDE,  " +
                              "NVL(TABELLE_COMUNI.ANAGRAFICADISTAC.INDIRIZZO,'') as INDIRIZZO," +
                              "NVL(TABELLE_COMUNI.ANAGRAFICADISTAC.CAP,'') as CAP " +
                              "FROM TABELLE_COMUNI.DISTACCAMENTI " +
                              "INNER JOIN TABELLE_COMUNI.ANAGRAFICADISTAC ON " +
                              "TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC = TABELLE_COMUNI.ANAGRAFICADISTAC.CODDISTAC " +
                              "AND TABELLE_COMUNI.DISTACCAMENTI.CODSEDE = TABELLE_COMUNI.ANAGRAFICADISTAC.CODSEDE " +
                              "WHERE(TABELLE_COMUNI.DISTACCAMENTI.CODSEDE = :CodSede) " +
                              "AND TABELLE_COMUNI.DISTACCAMENTI.FLGATTIVO = 1 " +
                              "ORDER BY TABELLE_COMUNI.DISTACCAMENTI.CODDISTAC ";

            cmd.CommandType = CommandType.Text;
            cmd.Parameters.Add(new OracleParameter("CodSede", CodSede));
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORADistaccamenti Distaccamento = new ORADistaccamenti()
                {
                    CODSEDE = Utility.Utility.GetDBField(dr, "CODSEDE"),
                    CODDISTAC = Convert.ToInt32(Utility.Utility.GetDBField(dr, "CODDISTAC")),
                    CAP = Utility.Utility.GetDBField(dr, "CAP"),
                    DESCDISTAC = Utility.Utility.GetDBField(dr, "DESCDISTAC"),
                    INDIRIZZO = Utility.Utility.GetDBField(dr, "INDIRIZZO")
                };

                ListaDistaccamenti.Add(Distaccamento);
            }

            conn.Dispose();
            return ListaDistaccamenti;
        }
    }
}
