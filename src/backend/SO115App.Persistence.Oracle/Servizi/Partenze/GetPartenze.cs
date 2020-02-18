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


        public List<ORAPartenze> GetListaPartenze(string CodSede)
        {
            List<ORAPartenze> ListaPartene = new List<ORAPartenze>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;


            cmd.CommandText = "select 	";     
        



            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAPartenze ORAP = new ORAPartenze();
                ORAP.INTERVENTO = Utility.Utility.GetDBField(dr, "XX");


                ListaPartene.Add(ORAP);
            }

            conn.Dispose();
            return ListaPartene;

        }

    

    }
}
