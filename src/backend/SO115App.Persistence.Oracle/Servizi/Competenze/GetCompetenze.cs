using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;


namespace SO115App.Persistence.Oracle.Servizi.Competenze
{
    public class GetCompetenze
    {

        public List<ORACompetenzeElenco> GetListaCompetenzeElenco(string CodSede)
        {
            List<ORACompetenzeElenco> ListaCompetenzeElenco = new List<ORACompetenzeElenco>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "select " +
                             "  NVL(ID_ZONA, 0)  AS ID_ZONA, "+
                             "  NVL(COD_DISTACCAMENTO, 0)  AS COD_DISTACCAMENTO," +
                             "  NVL(PRIORITA, 0)  AS PRIORITA," +
                             "  NVL(FLG_ATTIVO, 0)  AS FLG_ATTIVO," +
                             "  NVL(ID_TIPOLOGIA, 0)  AS ID_TIPOLOGIA," +
                             "  NVL(ORDINE_COMP, 0)  AS ORDINE_COMP " +
                             "  from SALAOPER.COMPETENZE_ELENCO   ";              

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORACompetenzeElenco ORAce = new ORACompetenzeElenco();
                ORAce.ID_ZONA = Utility.Utility.GetDBField(dr, "ID_ZONA");
                ORAce.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                ORAce.PRIORITA = Utility.Utility.GetDBField(dr, "PRIORITA");
                ORAce.FLG_ATTIVO = Utility.Utility.GetDBField(dr, "FLG_ATTIVO");
                ORAce.ID_TIPOLOGIA = Utility.Utility.GetDBField(dr, "ID_TIPOLOGIA");
                ORAce.ORDINE_COMP = Utility.Utility.GetDBField(dr, "ORDINE_COMP");
            
                ListaCompetenzeElenco.Add(ORAce);
            }

            conn.Dispose();
            return ListaCompetenzeElenco;

        }

        public List<ORACompetenzeZone> GetListaCompetenzeZone(string CodSede)
        {
            List<ORACompetenzeZone> ListaCompetenzeZone = new List<ORACompetenzeZone>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "select " +
                              " NVL(ID_ZONA, 0)  AS ID_ZONA, " +
                              " NVL(DESCRIZIONE, '')  AS DESCRIZIONE " +
                              " from SALAOPER.COMPETENZE_ZONE" ;



            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORACompetenzeZone ORAcz = new ORACompetenzeZone();
                ORAcz.ID_ZONA = Utility.Utility.GetDBField(dr, "ID_ZONA");
                ORAcz.DESCRIZIONE = Utility.Utility.GetDBField(dr, "DESCRIZIONE");
                ListaCompetenzeZone.Add(ORAcz);
            }

            conn.Dispose();
            return ListaCompetenzeZone;

        }
       
    }
}
