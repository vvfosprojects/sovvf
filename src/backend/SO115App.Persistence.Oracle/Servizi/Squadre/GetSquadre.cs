using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System.Collections.Generic;
using System.Data;
using SO115App.Persistence.Oracle.Utility;

namespace SO115App.Persistence.Oracle.Servizi.Squadre
{
    public class GetSquadre
    {
        public List<ORAGesPreaccoppiati> GetListaGesPreaccoppiati(string CodSede)
        {
            List<ORAGesPreaccoppiati> ListaGesPreaccoppiat = new List<ORAGesPreaccoppiati>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                    "NVL(COD_SQUADRA,	0) as	COD_SQUADRA  , " +
                    "NVL(COD_AUTOMEZZO,	0) as	COD_AUTOMEZZO," +
                    "NVL(CMOB_PARTENZA,	0) as	CMOB_PARTENZA " +
                    ",NVL(SALAOPER.AUTOMEZZI.COD_DISTACCAMENTO,	0) as	COD_DISTACCAMENTO " +
                   " ,NVLSALAOPER.AUTOMEZZI.COD_COMANDO,0) as COD_COMANDO " +
                    "FROM  SALAOPER.GES_PREACCOPPIATI , SALAOPER.AUTOMEZZI " +
                   " where      SALAOPER.AUTOMEZZI.COD_AUTOMEZZO = SALAOPER.GES_PREACCOPPIATI.COD_AUTOMEZZO " +
                   "and  COD_COMANDO = :COD_COMANDO ";

            cmd.CommandType = CommandType.Text;
            cmd.BindByName = true;
            cmd.Parameters.Add(new OracleParameter("COD_COMANDO", CodSede.ToUpper()));
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAGesPreaccoppiati Ges = new ORAGesPreaccoppiati();
                Ges.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                Ges.COD_AUTOMEZZO = Utility.Utility.GetDBField(dr, "COD_AUTOMEZZO");
                Ges.CMOB_PARTENZA = Utility.Utility.GetDBField(dr, "CMOB_PARTENZA");
                Ges.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                Ges.COD_COMANDO = Utility.Utility.GetDBField(dr, "COD_COMANDO");
                ListaGesPreaccoppiat.Add(Ges);
            }

            conn.Dispose();
            return ListaGesPreaccoppiat;
        }

        public ORASquadre GetSquadraByCodSquadra(string CodSede, decimal CodSquadra)
        {
            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                    "NVL(COD_SQUADRA             	,	0) as	COD_SQUADRA             	, " +
                    "NVL(SIGLA                   	,	'') as	SIGLA                   	," +
                    "NVL(COD_DISTACCAMENTO       	,	0) as	COD_DISTACCAMENTO       	," +
                    "NVL(COL_MOB                 	,	'') as	COL_MOB                 	," +
                    "NVL(PRIORITA_COMANDO        	,	0) as	PRIORITA_COMANDO        	," +
                    "NVL(PRIORITA_DISTACCAMENTO  	,	0) as	PRIORITA_DISTACCAMENTO  	," +
                    "NVL(SQUADRE_MANSIONE        	,	'') as	SQUADRE_MANSIONE        	," +
                    "NVL(STAMPA                  	,	'') as	STAMPA                  	," +
                    "NVL(SQUADRE_EMERGENZA       	,	'') as	SQUADRE_EMERGENZA       	," +
                    "NVL(NUMERO_PERSONE          	,	0) as	NUMERO_PERSONE          	," +
                    "NVL(VISUALIZZA              	,	'') as	VISUALIZZA              	," +
                    "NVL(CONTEGGIO_MENSA         	,	'') as	CONTEGGIO_MENSA         	," +
                    "NVL(SUPPORTO                	,	'') as	SUPPORTO                	" +
                    "FROM SALAOPER.SQUADRE WHERE COD_SQUADRA =:COD_SQUADRA";

            cmd.CommandType = CommandType.Text;
            cmd.BindByName = true;
            cmd.Parameters.Add(new OracleParameter("COD_SQUADRA", OracleDbType.Decimal, CodSquadra, ParameterDirection.Input));
            OracleDataReader dr = cmd.ExecuteReader();
            ORASquadre Squadra = new ORASquadre();
            while (dr.Read())
            {
                Squadra.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                Squadra.SIGLA = Utility.Utility.GetDBField(dr, "SIGLA");
                Squadra.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                Squadra.COL_MOB = Utility.Utility.GetDBField(dr, "COL_MOB");
                Squadra.PRIORITA_COMANDO = Utility.Utility.GetDBField(dr, "PRIORITA_COMANDO");
                Squadra.PRIORITA_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "PRIORITA_DISTACCAMENTO");
                Squadra.SQUADRE_MANSIONE = Utility.Utility.GetDBField(dr, "SQUADRE_MANSIONE");
                Squadra.STAMPA = Utility.Utility.GetDBField(dr, "STAMPA");
                Squadra.SQUADRE_EMERGENZA = Utility.Utility.GetDBField(dr, "SQUADRE_EMERGENZA");
                Squadra.NUMERO_PERSONE = Utility.Utility.GetDBField(dr, "NUMERO_PERSONE");
                Squadra.VISUALIZZA = Utility.Utility.GetDBField(dr, "VISUALIZZA");
                Squadra.CONTEGGIO_MENSA = Utility.Utility.GetDBField(dr, "CONTEGGIO_MENSA");
                Squadra.SUPPORTO = Utility.Utility.GetDBField(dr, "SUPPORTO");
            }

            conn.Dispose();
            return Squadra;
        }

        public List<ORASquadre> GetListaSquadre(string CodSede)
        {
            List<ORASquadre> ListaSquadre = new List<ORASquadre>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                    "NVL(COD_SQUADRA             	,	0) as	COD_SQUADRA             	, " +
                    "NVL(SIGLA                   	,	'') as	SIGLA                   	," +
                    "NVL(COD_DISTACCAMENTO       	,	0) as	COD_DISTACCAMENTO       	," +
                    "NVL(COL_MOB                 	,	'') as	COL_MOB                 	," +
                    "NVL(PRIORITA_COMANDO        	,	0) as	PRIORITA_COMANDO        	," +
                    "NVL(PRIORITA_DISTACCAMENTO  	,	0) as	PRIORITA_DISTACCAMENTO  	," +
                    "NVL(SQUADRE_MANSIONE        	,	'') as	SQUADRE_MANSIONE        	," +
                    "NVL(STAMPA                  	,	'') as	STAMPA                  	," +
                    "NVL(SQUADRE_EMERGENZA       	,	'') as	SQUADRE_EMERGENZA       	," +
                    "NVL(NUMERO_PERSONE          	,	0) as	NUMERO_PERSONE          	," +
                    "NVL(VISUALIZZA              	,	'') as	VISUALIZZA              	," +
                    "NVL(CONTEGGIO_MENSA         	,	'') as	CONTEGGIO_MENSA         	," +
                    "NVL(SUPPORTO                	,	'') as	SUPPORTO                	" +
                    "FROM SALAOPER.SQUADRE";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORASquadre squadra = new ORASquadre();
                squadra.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                squadra.SIGLA = Utility.Utility.GetDBField(dr, "SIGLA");
                squadra.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                squadra.COL_MOB = Utility.Utility.GetDBField(dr, "COL_MOB");
                squadra.PRIORITA_COMANDO = Utility.Utility.GetDBField(dr, "PRIORITA_COMANDO");
                squadra.PRIORITA_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "PRIORITA_DISTACCAMENTO");
                squadra.SQUADRE_MANSIONE = Utility.Utility.GetDBField(dr, "SQUADRE_MANSIONE");
                squadra.STAMPA = Utility.Utility.GetDBField(dr, "STAMPA");
                squadra.SQUADRE_EMERGENZA = Utility.Utility.GetDBField(dr, "SQUADRE_EMERGENZA");
                squadra.NUMERO_PERSONE = Utility.Utility.GetDBField(dr, "NUMERO_PERSONE");
                squadra.VISUALIZZA = Utility.Utility.GetDBField(dr, "VISUALIZZA");
                squadra.CONTEGGIO_MENSA = Utility.Utility.GetDBField(dr, "CONTEGGIO_MENSA");
                squadra.SUPPORTO = Utility.Utility.GetDBField(dr, "SUPPORTO");

                ListaSquadre.Add(squadra);
            }

            conn.Dispose();
            return ListaSquadre;
        }

        public ORASQPersonaleSquadre GetSQPersonaleSquadreByCodSquadra(string CodSede, decimal CodSquadra)
        {
            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                "NVL(COD_SQUADRA,	0) as	 COD_SQUADRA, " +
                "NVL(TURNO,	'') as	 TURNO, " +
                "NVL(DATA_SERVIZIO,	'') as	 DATA_SERVIZIO, " +
                "NVL(STATO,	'') as	 STATO, " +
                "NVL(SIGLA,	'') as	 SIGLA, " +
                "NVL(COD_DISTACCAMENTO,	0) as	 COD_DISTACCAMENTO, " +
                "NVL(SQUADRA_EMERGENZA,	'') as	 SQUADRA_EMERGENZA, " +
                "NVL(VISUALIZZA,	'') as	 VISUALIZZA  " +
               "FROM SALAOPER.SQ_PERSONALE_SQUADRE WHERE COD_SQUADRA =:COD_SQUADRA" +
               "  AND STATO  IN ('L','A','R')  ";

            cmd.CommandType = CommandType.Text;
            cmd.BindByName = true;
            cmd.Parameters.Add(new OracleParameter("COD_SQUADRA", OracleDbType.Decimal, CodSquadra, ParameterDirection.Input));
            OracleDataReader dr = cmd.ExecuteReader();
            ORASQPersonaleSquadre ORASQPs = new ORASQPersonaleSquadre();
            while (dr.Read())
            {
                ORASQPs.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                ORASQPs.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORASQPs.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORASQPs.STATO = Utility.Utility.GetDBField(dr, "STATO");
                ORASQPs.SIGLA = Utility.Utility.GetDBField(dr, "SIGLA");
                ORASQPs.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                ORASQPs.SQUADRA_EMERGENZA = Utility.Utility.GetDBField(dr, "SQUADRA_EMERGENZA");
                ORASQPs.VISUALIZZA = Utility.Utility.GetDBField(dr, "VISUALIZZA");
            }

            conn.Dispose();
            return ORASQPs;
        }

        public List<ORASQPersonaleSquadre> GetListaSQPersonaleSquadre(string CodSede)
        {
            List<ORASQPersonaleSquadre> ListaSQPersonaleSquadre = new List<ORASQPersonaleSquadre>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                "NVL(COD_SQUADRA,	0) as	 COD_SQUADRA, " +
                "NVL(TURNO,	'') as	 TURNO, " +
                "NVL(DATA_SERVIZIO,	'') as	 DATA_SERVIZIO, " +
                "NVL(STATO,	'') as	 STATO, " +
                "NVL(SIGLA,	'') as	 SIGLA, " +
                "NVL(COD_DISTACCAMENTO,	0) as	 COD_DISTACCAMENTO, " +
                "NVL(SQUADRA_EMERGENZA,	'') as	 SQUADRA_EMERGENZA, " +
                "NVL(VISUALIZZA,	'') as	 VISUALIZZA  " +
               "FROM SALAOPER.SQ_PERSONALE_SQUADRE " +
               " where  STATO  IN ('L','A','R')  ";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORASQPersonaleSquadre ORASQPs = new ORASQPersonaleSquadre();
                ORASQPs.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                ORASQPs.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORASQPs.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORASQPs.STATO = Utility.Utility.GetDBField(dr, "STATO");
                ORASQPs.SIGLA = Utility.Utility.GetDBField(dr, "SIGLA");
                ORASQPs.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                ORASQPs.SQUADRA_EMERGENZA = Utility.Utility.GetDBField(dr, "SQUADRA_EMERGENZA");
                ORASQPs.VISUALIZZA = Utility.Utility.GetDBField(dr, "VISUALIZZA");
                ListaSQPersonaleSquadre.Add(ORASQPs);
            }

            conn.Dispose();
            return ListaSQPersonaleSquadre;
        }

        public ORAPersonaleSquadre GetPersonaleSquadraByCodSquadra(string CodSede, decimal CodSquadra)
        {
            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                      "	NVL( COD_SQUADRA              	,	0) as	 COD_SQUADRA ,	" +
                    "	NVL(MATDIP                  	,	'') as	 MATDIP                  	,	" +
                    "	NVL(FLAG_CAPO_SQUADRA       	,	'') as	 FLAG_CAPO_SQUADRA       	,	" +
                    "	NVL(DATA_SERVIZIO           	,	'') as	 DATA_SERVIZIO           	,	" +
                    "	NVL(TURNO                   	,	'') as	 TURNO                   	,	" +
                    "	NVL(AUTISTA                 	,	'') as	 AUTISTA                 	,	" +
                    "	NVL(QUALIFICA_ABBREV        	,	'') as	 QUALIFICA_ABBREV        	,	" +
                    "	NVL(COD_DISTACCAMENTO       	,	0) as	 COD_DISTACCAMENTO       	,	" +
                    "	NVL(PROGRESSIVO             	,	0) as	 PROGRESSIVO             	,	" +
                    "	NVL(ORA_INIZIO              	,	'') as	 ORA_INIZIO              	,	" +
                    "	NVL(ORA_FINE                	,	'') as	 ORA_FINE                	,	" +
                    "	NVL(DATA_ULT_AGG            	,	'') as	 DATA_ULT_AGG            	,	" +
                    "	NVL(ULTERIORI_AUTISTI 	,	0) as	 ULTERIORI_AUTISTI 	" +
                       "FROM SALAOPER.PERSONALE_SQUADRE WHERE COD_SQUADRA =:COD_SQUADRA";

            cmd.CommandType = CommandType.Text;
            cmd.BindByName = true;
            cmd.Parameters.Add(new OracleParameter("COD_SQUADRA", OracleDbType.Decimal, CodSquadra, ParameterDirection.Input));
            OracleDataReader dr = cmd.ExecuteReader();

            ORAPersonaleSquadre ORAPs = new ORAPersonaleSquadre();
            while (dr.Read())
            {
                ORAPs.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                ORAPs.MATDIP = Utility.Utility.GetDBField(dr, "MATDIP");
                ORAPs.FLAG_CAPO_SQUADRA = Utility.Utility.GetDBField(dr, "FLAG_CAPO_SQUADRA");
                ORAPs.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORAPs.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORAPs.AUTISTA = Utility.Utility.GetDBField(dr, "AUTISTA");
                ORAPs.QUALIFICA_ABBREV = Utility.Utility.GetDBField(dr, "QUALIFICA_ABBREV");
                ORAPs.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                ORAPs.PROGRESSIVO = Utility.Utility.GetDBField(dr, "PROGRESSIVO");
                ORAPs.ORA_INIZIO = Utility.Utility.GetDBField(dr, "ORA_INIZIO");
                ORAPs.ORA_FINE = Utility.Utility.GetDBField(dr, "ORA_FINE");
                ORAPs.DATA_ULT_AGG = Utility.Utility.GetDBField(dr, "DATA_ULT_AGG");
                ORAPs.ULTERIORI_AUTISTI = Utility.Utility.GetDBField(dr, "ULTERIORI_AUTISTI");
            }

            conn.Dispose();
            return ORAPs;
        }

        public List<ORAPersonaleSquadre> GetListaPersonaleSquadre(string CodSede)
        {
            List<ORAPersonaleSquadre> ListaPersonaleSquadre = new List<ORAPersonaleSquadre>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
                      "	NVL( COD_SQUADRA              	,	0) as	 COD_SQUADRA ,	" +
                    "	NVL(MATDIP                  	,	'') as	 MATDIP                  	,	" +
                    "	NVL(FLAG_CAPO_SQUADRA       	,	'') as	 FLAG_CAPO_SQUADRA       	,	" +
                    "	NVL(DATA_SERVIZIO           	,	'') as	 DATA_SERVIZIO           	,	" +
                    "	NVL(TURNO                   	,	'') as	 TURNO                   	,	" +
                    "	NVL(AUTISTA                 	,	'') as	 AUTISTA                 	,	" +
                    "	NVL(QUALIFICA_ABBREV        	,	'') as	 QUALIFICA_ABBREV        	,	" +
                    "	NVL(COD_DISTACCAMENTO       	,	0) as	 COD_DISTACCAMENTO       	,	" +
                    "	NVL(PROGRESSIVO             	,	0) as	 PROGRESSIVO             	,	" +
                    "	NVL(ORA_INIZIO              	,	'') as	 ORA_INIZIO              	,	" +
                    "	NVL(ORA_FINE                	,	'') as	 ORA_FINE                	,	" +
                    "	NVL(DATA_ULT_AGG            	,	'') as	 DATA_ULT_AGG            	,	" +
                    "	NVL(ULTERIORI_AUTISTI 	,	0) as	 ULTERIORI_AUTISTI 	" +
                       "FROM SALAOPER.PERSONALE_SQUADRE";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAPersonaleSquadre ORAPs = new ORAPersonaleSquadre();
                ORAPs.COD_SQUADRA = Utility.Utility.GetDBField(dr, "COD_SQUADRA");
                ORAPs.MATDIP = Utility.Utility.GetDBField(dr, "MATDIP");
                ORAPs.FLAG_CAPO_SQUADRA = Utility.Utility.GetDBField(dr, "FLAG_CAPO_SQUADRA");
                ORAPs.DATA_SERVIZIO = Utility.Utility.GetDBField(dr, "DATA_SERVIZIO");
                ORAPs.TURNO = Utility.Utility.GetDBField(dr, "TURNO");
                ORAPs.AUTISTA = Utility.Utility.GetDBField(dr, "AUTISTA");
                ORAPs.QUALIFICA_ABBREV = Utility.Utility.GetDBField(dr, "QUALIFICA_ABBREV");
                ORAPs.COD_DISTACCAMENTO = Utility.Utility.GetDBField(dr, "COD_DISTACCAMENTO");
                ORAPs.PROGRESSIVO = Utility.Utility.GetDBField(dr, "PROGRESSIVO");
                ORAPs.ORA_INIZIO = Utility.Utility.GetDBField(dr, "ORA_INIZIO");
                ORAPs.ORA_FINE = Utility.Utility.GetDBField(dr, "ORA_FINE");
                ORAPs.DATA_ULT_AGG = Utility.Utility.GetDBField(dr, "DATA_ULT_AGG");
                ORAPs.ULTERIORI_AUTISTI = Utility.Utility.GetDBField(dr, "ULTERIORI_AUTISTI");

                ListaPersonaleSquadre.Add(ORAPs);
            }

            conn.Dispose();
            return ListaPersonaleSquadre;
        }
    }
}
