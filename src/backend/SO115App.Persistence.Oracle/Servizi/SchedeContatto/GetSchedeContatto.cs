using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Classi;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SO115App.Persistence.Oracle.Servizi.SchedeContatto
{
    public class GetSchedeContatto
    {
        public List<ORASchedaContatto> GetListaSchedeContatto(string CodSede)
        {
            List<ORASchedaContatto> ListaSchede = new List<ORASchedaContatto>();

            DBContext context = new DBContext();
            Connessione InfoCon = context.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;
            cmd.CommandText = "SELECT " +
                "ID_CONTATTO," +
                "ID_SES," +
                "NOME, " +
                "COGNOME, " +
                "LUOGO_NASC, " +
                "DATA_NASC," +
                "RAG_SOCIALE," +
                "TEL_PUBL," +
                "TOPONIMO, " +
                "INDIRIZZO, " +
                "CIVICO," +
                "ADD_INFO, " +
                "CITTA, " +
                "DISTRETTO, " +
                "PROVINCIA," +
                "CAP, " +
                "LAT, " +
                "LON," +
                "ANGOLO," +
                "RMAX, " +
                "RMIN," +
                "UM_ANG," +
                "UM_DIST," +
                "DATA_LOC," +
                "UCTOFFSET," +
                "SHAPE, " +
                "START_ANG, " +
                "STOP_ANG," +
                "POLYLINE," +
                "LEV_CONF, " +
                "CID," +
                "NOTE_AREU, " +
                "ALTROENTE_IDSCHEDA," +
                "ALTROENTE_NOME," +
                "ALTROENTE_DATAINS," +
                "ALTROENTE_DATAINVIO, " +
                "OP_ID," +
                "CLI," +
                "DATA_RICEZIONE, " +
                "COMPETENZA, " +
                "DATA_INS, " +
                "FORWARDEDTO," +
                "FLG_GESTITA, " +
                "HIGHPRIORITY, " +
                "INOLTRO_DA_SO_A, " +
                "DATA_INOLTRO_DA_SO," +
                "NOTE_INTERVENTO," +
                "OPERATORE_INVIO_SCHEDA," +
                "FLG_INTERNA," +
                "RICEVUTA_DA, " +
                "COD_TIPOLOGIA, " +
                "SIGLA_SEDE_INVIO," +
                "DIFFERIBILE," +
                "DESCRIZIONE_TRIAGE, " +
                "COD_TRIAGE, " +
                "DATA_MARCATO_DIFFERIBILE," +
                "NOTE_MARCATO_DIFFERIBILE, " +
                "USER_MARCATO_DIFFERIBILE " +
                "FROM NUESO.NUE_CONTATTO WHERE PROVINCIA='" + CodSede + "'";
            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORASchedaContatto scheda = new ORASchedaContatto();
                scheda.ID_CONTATTO = dr.GetInt32(0);
                scheda.ID_SES = dr.GetInt32(1);
                scheda.NOME = dr.IsDBNull(2) ? "" : dr.GetString(2);
                scheda.COGNOME = dr.IsDBNull(3) ? "" : dr.GetString(3);
                scheda.LUOGO_NASC = dr.IsDBNull(4) ? "" : dr.GetString(4);
                scheda.DATA_NASC = dr.IsDBNull(5) ? "" : dr.GetString(5);
                scheda.RAG_SOCIALE = dr.IsDBNull(6) ? "" : dr.GetString(6);
                scheda.TEL_PUBL = dr.IsDBNull(7) ? "" : dr.GetString(7);
                scheda.TOPONIMO = dr.IsDBNull(8) ? "" : dr.GetString(8);
                scheda.INDIRIZZO = dr.IsDBNull(9) ? "" : dr.GetString(9);
                scheda.CIVICO = dr.IsDBNull(10) ? "" : dr.GetString(10);
                scheda.ADD_INFO = dr.IsDBNull(11) ? "" : dr.GetString(11);
                scheda.CITTA = dr.IsDBNull(12) ? "" : dr.GetString(12);
                scheda.DISTRETTO = dr.IsDBNull(13) ? "" : dr.GetString(13);
                scheda.PROVINCIA = dr.IsDBNull(14) ? "" : dr.GetString(14);
                scheda.CAP = dr.IsDBNull(15) ? "" : dr.GetString(15);
                scheda.LAT = dr.IsDBNull(16) ? 0 : dr.GetDecimal(16);
                scheda.LON = dr.IsDBNull(17) ? 0 : dr.GetDecimal(17);
                scheda.ANGOLO = dr.IsDBNull(18) ? 0 : dr.GetInt32(18);
                scheda.RMAX = dr.IsDBNull(19) ? 0 : dr.GetInt32(19);
                scheda.RMIN = dr.IsDBNull(20) ? 0 : dr.GetInt32(20);
                scheda.UM_ANG = dr.IsDBNull(21) ? "" : dr.GetString(21);
                scheda.UM_DIST = dr.IsDBNull(22) ? "" : dr.GetString(22);
                scheda.DATA_LOC = dr.IsDBNull(23) ? DateTime.MinValue : dr.GetDateTime(23);
                scheda.UCTOFFSET = dr.IsDBNull(24) ? "" : dr.GetString(24);
                scheda.SHAPE = dr.IsDBNull(25) ? "" : dr.GetString(25);
                scheda.START_ANG = dr.IsDBNull(26) ? 0 : dr.GetInt32(26);
                scheda.STOP_ANG = dr.IsDBNull(27) ? 0 : dr.GetInt32(27);
                scheda.POLYLINE = dr.IsDBNull(28) ? "" : dr.GetString(28);
                scheda.LEV_CONF = dr.IsDBNull(29) ? "" : dr.GetString(29);
                scheda.CID = dr.IsDBNull(30) ? "" : dr.GetString(30);
                scheda.NOTE_AREU = dr.IsDBNull(31) ? "" : dr.GetString(31);
                scheda.ALTROENTE_IDSCHEDA = dr.IsDBNull(32) ? "" : dr.GetString(32);
                scheda.ALTROENTE_NOME = dr.IsDBNull(33) ? "" : dr.GetString(33);
                scheda.ALTROENTE_DATAINS = dr.IsDBNull(34) ? DateTime.MinValue : dr.GetDateTime(34);
                scheda.ALTROENTE_DATAINVIO = dr.IsDBNull(35) ? DateTime.MinValue : dr.GetDateTime(35);
                scheda.OP_ID = dr.IsDBNull(36) ? 0 : dr.GetInt32(36);
                scheda.CLI = dr.IsDBNull(37) ? "" : dr.GetString(37);
                scheda.DATA_RICEZIONE = dr.IsDBNull(38) ? DateTime.MinValue : dr.GetDateTime(38);
                scheda.COMPETENZA = dr.IsDBNull(39) ? "" : dr.GetString(39);
                scheda.DATA_INS = dr.IsDBNull(40) ? DateTime.MinValue : dr.GetDateTime(40);
                scheda.FORWARDEDTO = dr.IsDBNull(41) ? "" : dr.GetString(41);
                scheda.FLG_GESTITA = dr.IsDBNull(42) ? "" : dr.GetString(42);
                scheda.HIGHPRIORITY = dr.IsDBNull(43) ? "" : dr.GetString(43);
                scheda.INOLTRO_DA_SO_A = dr.IsDBNull(44) ? "" : dr.GetString(44);
                scheda.DATA_INOLTRO_DA_SO = dr.IsDBNull(45) ? DateTime.MinValue : dr.GetDateTime(45);
                scheda.NOTE_INTERVENTO = dr.IsDBNull(46) ? "" : dr.GetString(46);
                scheda.OPERATORE_INVIO_SCHEDA = dr.IsDBNull(47) ? "" : dr.GetString(47);
                scheda.FLG_INTERNA = dr.IsDBNull(48) ? "" : dr.GetString(48);
                scheda.RICEVUTA_DA = dr.IsDBNull(49) ? "" : dr.GetString(49);
                scheda.COD_TIPOLOGIA = dr.IsDBNull(50) ? "" : dr.GetString(50);
                scheda.SIGLA_SEDE_INVIO = dr.IsDBNull(51) ? "" : dr.GetString(51);
                scheda.DIFFERIBILE = dr.IsDBNull(52) ? "" : dr.GetString(52);
                scheda.DESCRIZIONE_TRIAGE = dr.IsDBNull(53) ? "" : dr.GetString(53);
                scheda.COD_TRIAGE = dr.IsDBNull(54) ? "" : dr.GetString(54);
                scheda.DATA_MARCATO_DIFFERIBILE = dr.IsDBNull(55) ? DateTime.MinValue : dr.GetDateTime(55);
                scheda.NOTE_MARCATO_DIFFERIBILE = dr.IsDBNull(56) ? "" : dr.GetString(56);
                scheda.USER_MARCATO_DIFFERIBILE = dr.IsDBNull(57) ? "" : dr.GetString(57);

                ListaSchede.Add(scheda);
            }

            conn.Dispose();

            return ListaSchede;
        }
    }
}
