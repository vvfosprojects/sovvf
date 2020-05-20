using Oracle.ManagedDataAccess.Client;
using SO115App.Persistance.Oracle.Core.Interfacce;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneServizi;
using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;
using System.Data;

namespace SO115App.Persistence.Oracle.Core.Servizi.GestioneServizi
{
    public class GetServizi: IGetServizi
    {
        private readonly IDBContext _dbContext;

        public GetServizi(IDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ORAServizi> GetListaServizi(string CodSede)
        {
            List<ORAServizi> ListaServizi = new List<ORAServizi>();

            Connessione InfoCon = _dbContext.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                "NVL(DATA_SERVIZIO,	'') as	 DATA_SERVIZIO, " +
                "NVL(TURNO,	'') as	 TURNO, " +
                "NVL(FASCIA,	'') as	 FASCIA, " +
                "NVL(STATO,	'') as	 STATO, " +
                "NVL(NOTE,	'') as	 NOTE, " +
                "NVL(TIPO_SERVIZIO,	'') as	 TIPO_SERVIZIO, " +
                "NVL(GES_SEMPLIFICATA,	'') as	 GES_SEMPLIFICATA, " +
                "NVL(UDS,	'') as	 UDS, " +
                "NVL(UTS1,	'') as	 UTS1, " +
                "NVL(UTS2,	'') as	 UTS2, " +
                "NVL(CAPO_TURNO,	'') as	 CAPO_TURNO, " +
                "NVL(DISP_SQUADRE,	'') as	 DISP_SQUADRE " +
                "FROM SALAOPER.SERVIZI";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAServizi ORASe = new ORAServizi();
                ORASe.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORASe.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORASe.FASCIA = Utility.Utility.GetDBField(dr, "FASCIA");
                ORASe.STATO = Utility.Utility.GetDBField(dr, "STATO");
                ORASe.NOTE = Utility.Utility.GetDBField(dr, "NOTE");
                ORASe.TIPO_SERVIZIO = Utility.Utility.GetDBField(dr, "TIPO_SERVIZIO");
                ORASe.GES_SEMPLIFICATA = Utility.Utility.GetDBField(dr, "GES_SEMPLIFICATA");
                ORASe.UDS = Utility.Utility.GetDBField(dr, "UDS");
                ORASe.UTS1 = Utility.Utility.GetDBField(dr, "UTS1");
                ORASe.UTS2 = Utility.Utility.GetDBField(dr, "UTS2");
                ORASe.CAPO_TURNO = Utility.Utility.GetDBField(dr, "CAPO_TURNO");
                ORASe.DISP_SQUADRE = Utility.Utility.GetDBField(dr, "DISP_SQUADRE");
                ListaServizi.Add(ORASe);
            }

            conn.Dispose();
            return ListaServizi;
        }
    }
}
