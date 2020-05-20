using Oracle.ManagedDataAccess.Client;
using SO115App.Persistance.Oracle.Core.Interfacce;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneChiamate;
using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;
using System.Data;

namespace SO115App.Persistence.Oracle.Core.Servizi.GestioneChiamate
{
    public class GetChiamate: IGetChiamate
    {
        private readonly IDBContext _dbContext;

        public GetChiamate(IDBContext dbContext)
        {
            _dbContext = dbContext;
        }

        public List<ORAChiamate> GetListaChiamate(string CodSede)
        {
            List<ORAChiamate> ListaChiamate = new List<ORAChiamate>();

            Connessione InfoCon = _dbContext.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
             " NVL(CHIAMATA, 0) as	CHIAMATA," +
            " NVL(DATA_CHIAMATA,'') as	DATA_CHIAMATA," +
            " NVL(ORA_CHIAMATA,'') as	ORA_CHIAMATA," +
            " NVL(TURNO_CHIAMATA,'') as	TURNO_CHIAMATA," +
            " NVL(COD_TIPOLOGIA, 0) as	COD_TIPOLOGIA," +
            " NVL(DETTAGLIO_TIPOLOGIA,'') as	DETTAGLIO_TIPOLOGIA," +
            " NVL(NOTE_INTERVENTO,'') as	NOTE_INTERVENTO," +
            " NVL(LOC_INDIRIZZO,'') as	LOC_INDIRIZZO," +
            " NVL(LOCALITA,'') as	LOCALITA," +
            " NVL(COD_STRADA,'') as	COD_STRADA," +
            " NVL(NUM_CIVICO,'') as	NUM_CIVICO," +
            " NVL(COD_COMUNE, 0) as	COD_COMUNE," +
            " NVL(SIGLA_PROVINCIA,'') as	SIGLA_PROVINCIA," +
            " NVL(RICHIEDENTE,'') as	RICHIEDENTE," +
            " NVL(TELE_NUMERO,'') as	TELE_NUMERO," +
            " NVL(COMANDO,'') as	COMANDO," +
            " NVL(SCHEDA_ALTRO_COMANDO,'') as	SCHEDA_ALTRO_COMANDO," +
            " NVL(MATRICOLA_OPERATORE_CHIAMATA,'') as	MATRICOLA_OPERATORE_CHIAMATA," +
            " NVL(RICEVUTA_TRASMESSA,'') as	RICEVUTA_TRASMESSA," +
            " NVL(COD_OBIETTIVO, 0) as	COD_OBIETTIVO," +
            " NVL(COD_STRADA_INCROCIO,'') as	COD_STRADA_INCROCIO," +
            " NVL(FLAG_CIV_KM,'') as	FLAG_CIV_KM," +
            " NVL(COD_PRIORITA, 0) as	COD_PRIORITA," +
            " NVL(EDGID_STRADA, 0) as	EDGID_STRADA," +
            " NVL(CODICE_PI, 0) as	CODICE_PI," +
            " NVL(X, 0) as	X," +
            " NVL(Y, 0) as	Y," +
            " NVL(ID_INCROCIO, 0) as	ID_INCROCIO," +
            " NVL(ID_ZONA, 0) as	ID_ZONA," +
            " NVL(DESC_LUOGO,'') as	DESC_LUOGO," +
            " NVL(FLAG_R,'') as	FLAG_R," +
            " NVL(ID_112, 0) as	ID_112," +
            " NVL(COD_DIST_PREALL,0) as	COD_DIST_PREALL," +
            " NVL(ZONA_EMERGENZA,'') as	ZONA_EMERGENZA," +
            " NVL(PALAZZO,'') as	PALAZZO," +
            " NVL(SCALA,'') as	SCALA," +
            " NVL(PIANO,'') as	PIANO," +
            " NVL(INTERNO,'') as	INTERNO," +
            " NVL(CIVICO_VICINO	,	'') as	CIVICO_VICINO	 " +
            "from SALAOPER.CHIAMATE  ";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAChiamate ORACh = new ORAChiamate();
                ORACh.CHIAMATA = Utility.Utility.GetDBField(dr, "CHIAMATA");
                ORACh.DATA_CHIAMATA = Utility.Utility.GetDBField(dr, "DATA_CHIAMATA");
                ORACh.ORA_CHIAMATA = Utility.Utility.GetDBField(dr, "ORA_CHIAMATA");
                ORACh.TURNO_CHIAMATA = Utility.Utility.GetDBField(dr, "TURNO_CHIAMATA");
                ORACh.COD_TIPOLOGIA = Utility.Utility.GetDBField(dr, "COD_TIPOLOGIA");
                ORACh.DETTAGLIO_TIPOLOGIA = Utility.Utility.GetDBField(dr, "DETTAGLIO_TIPOLOGIA");
                ORACh.NOTE_INTERVENTO = Utility.Utility.GetDBField(dr, "NOTE_INTERVENTO");
                ORACh.LOC_INDIRIZZO = Utility.Utility.GetDBField(dr, "LOC_INDIRIZZO");
                ORACh.LOCALITA = Utility.Utility.GetDBField(dr, "LOCALITA");
                ORACh.COD_STRADA = Utility.Utility.GetDBField(dr, "COD_STRADA");
                ORACh.NUM_CIVICO = Utility.Utility.GetDBField(dr, "NUM_CIVICO");
                ORACh.COD_COMUNE = Utility.Utility.GetDBField(dr, "COD_COMUNE");
                ORACh.SIGLA_PROVINCIA = Utility.Utility.GetDBField(dr, "SIGLA_PROVINCIA");
                ORACh.RICHIEDENTE = Utility.Utility.GetDBField(dr, "RICHIEDENTE");
                ORACh.TELE_NUMERO = Utility.Utility.GetDBField(dr, "TELE_NUMERO");
                ORACh.COMANDO = Utility.Utility.GetDBField(dr, "COMANDO");
                ORACh.SCHEDA_ALTRO_COMANDO = Utility.Utility.GetDBField(dr, "SCHEDA_ALTRO_COMANDO");
                ORACh.MATRICOLA_OPERATORE_CHIAMATA = Utility.Utility.GetDBField(dr, "MATRICOLA_OPERATORE_CHIAMATA");
                ORACh.RICEVUTA_TRASMESSA = Utility.Utility.GetDBField(dr, "RICEVUTA_TRASMESSA");
                ORACh.COD_OBIETTIVO = Utility.Utility.GetDBField(dr, "COD_OBIETTIVO");
                ORACh.COD_STRADA_INCROCIO = Utility.Utility.GetDBField(dr, "COD_STRADA_INCROCIO");
                ORACh.FLAG_CIV_KM = Utility.Utility.GetDBField(dr, "FLAG_CIV_KM");
                ORACh.COD_PRIORITA = Utility.Utility.GetDBField(dr, "COD_PRIORITA");
                ORACh.EDGID_STRADA = Utility.Utility.GetDBField(dr, "EDGID_STRADA");
                ORACh.CODICE_PI = Utility.Utility.GetDBField(dr, "CODICE_PI");
                ORACh.X = Utility.Utility.GetDBField(dr, "X");
                ORACh.Y = Utility.Utility.GetDBField(dr, "Y");
                ORACh.ID_INCROCIO = Utility.Utility.GetDBField(dr, "ID_INCROCIO");
                ORACh.ID_ZONA = Utility.Utility.GetDBField(dr, "ID_ZONA");
                ORACh.DESC_LUOGO = Utility.Utility.GetDBField(dr, "DESC_LUOGO");
                ORACh.FLAG_R = Utility.Utility.GetDBField(dr, "FLAG_R");
                ORACh.ID_112 = Utility.Utility.GetDBField(dr, "ID_112");
                ORACh.COD_DIST_PREALL = Utility.Utility.GetDBField(dr, "COD_DIST_PREALL");
                ORACh.ZONA_EMERGENZA = Utility.Utility.GetDBField(dr, "ZONA_EMERGENZA");
                ORACh.PALAZZO = Utility.Utility.GetDBField(dr, "PALAZZO");
                ORACh.SCALA = Utility.Utility.GetDBField(dr, "SCALA");
                ORACh.PIANO = Utility.Utility.GetDBField(dr, "PIANO");
                ORACh.INTERNO = Utility.Utility.GetDBField(dr, "INTERNO");
                ORACh.CIVICO_VICINO = Utility.Utility.GetDBField(dr, "CIVICO_VICINO");
                ListaChiamate.Add(ORACh);
            }

            conn.Dispose();
            return ListaChiamate;
        }
    }
}
