using Oracle.ManagedDataAccess.Client;
using SO115App.Persistence.Oracle.Core.Classi;
using System.Collections.Generic;
using System.Data;
using System;
using SO115App.Persistance.Oracle.Core.Interfacce;
using SO115App.Persistance.Oracle.Core.Interfacce.GestioneRichieste;

namespace SO115App.Persistence.Oracle.Core.Servizi.GestioneRichieste
{
    public class GetInterventi: IGetRichieste
    {
        private readonly IDBContext _dbcontext;

        public GetInterventi(IDBContext dbcontext)
        {
            _dbcontext = dbcontext;
        }

        public List<ORAInterventiChiusi> GetListaInterventiChiusi(string CodSede)
        {
            List<ORAInterventiChiusi> ListaInterventiChiusi = new List<ORAInterventiChiusi>();

            Connessione InfoCon = _dbcontext.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
            "NVL(INTERVENTO,	'') as	 INTERVENTO," +
            "NVL(DATA_CHIAMATA,	'') as	 DATA_CHIAMATA," +
            "NVL(ORA_CHIAMATA,	'') as	 ORA_CHIAMATA," +
            "NVL(DATA_INTERVENTO,	'') as	 DATA_INTERVENTO," +
            "NVL(ORA_USCITA,	'') as	 ORA_USCITA," +
            "NVL(TURNO_CHIAMATA,	'') as	 TURNO_CHIAMATA," +
            "NVL(TURNO_INTERVENTO,	'') as	 TURNO_INTERVENTO," +
            "NVL(COD_TIPOLOGIA,	'') as	 COD_TIPOLOGIA," +
            "NVL(DETTAGLIO_TIPOLOGIA,	'') as	 DETTAGLIO_TIPOLOGIA," +
            "NVL(NOTE_INTERVENTO,	'') as	 NOTE_INTERVENTO," +
            "NVL(LOC_INDIRIZZO,	'') as	 LOC_INDIRIZZO," +
            "NVL(LOCALITA,	'') as	 LOCALITA," +
            "NVL(COD_STRADA,	'') as	 COD_STRADA," +
            "NVL(NUM_CIVICO,	'') as	 NUM_CIVICO," +
            "NVL(COD_COMUNE,	'') as	 COD_COMUNE," +
            "NVL(SIGLA_PROVINCIA,	'') as	 SIGLA_PROVINCIA," +
            "NVL(RICHIEDENTE,	'') as	 RICHIEDENTE," +
            "NVL(TELE_NUMERO,	'') as	 TELE_NUMERO," +
            "NVL(COMANDO,	'') as	 COMANDO," +
            "NVL(SCHEDA_ALTRO_COMANDO,	'') as	 SCHEDA_ALTRO_COMANDO," +
            "NVL(NATURA,	'') as	 NATURA," +
            "NVL(MATRICOLA_OPERATORE_CHIAMATA,	'') as	 MATRICOLA_OPERATORE_CHIAMATA," +
            "NVL(MATRICOLA_OPERATORE_INTERVENTO,	'') as	 MATRICOLA_OPERATORE_INTERVENTO," +
            "NVL(STATUS,	'') as	 STATUS," +
            "NVL(ENTI_INTERVENUTI,	'') as	 ENTI_INTERVENUTI," +
            "NVL(ORA_CHIUSURA,	'') as	 ORA_CHIUSURA," +
            "NVL(DATA_CHIUSURA,	'') as	 DATA_CHIUSURA," +
            "NVL(FLAG_DOC_SN,	'') as	 FLAG_DOC_SN," +
            "NVL(RICEVUTA_TRASMESSA,	'') as	 RICEVUTA_TRASMESSA," +
            "NVL(COD_OBIETTIVO,	'') as	 COD_OBIETTIVO," +
            "NVL(COD_STRADA_INCROCIO,	'') as	 COD_STRADA_INCROCIO," +
            "NVL(FLAG_CIV_KM,	'') as	 FLAG_CIV_KM," +
            "NVL(FLAG_AGGIOR,	'') as	 FLAG_AGGIOR," +
            "NVL(NOME_STRADA,	'') as	 NOME_STRADA," +
            "NVL(EDGID_STRADA,	'') as	 EDGID_STRADA," +
            "NVL(NOME_STRADA_INCROCIO,	'') as	 NOME_STRADA_INCROCIO," +
            "NVL(EDGID_STRADA_INCROCIO,	'') as	 EDGID_STRADA_INCROCIO," +
            "NVL(COD_PRIORITA,	'') as	 COD_PRIORITA," +
            "NVL(PROGR_INTERVENTO,	'') as	 PROGR_INTERVENTO," +
            "NVL(CODICE_PI,	'') as	 CODICE_PI," +
            "NVL(INTERVENTO_RILEVANTE,	'') as	 INTERVENTO_RILEVANTE," +
            "NVL(BOSCHI,	'') as	 BOSCHI," +
            "NVL(CAMPI ,	'') as	 CAMPI ," +
            "NVL(STERPAGLIE,	'') as	 STERPAGLIE," +
            "NVL(X     ,	'') as	 X     ," +
            "NVL(Y     ,	'') as	 Y     ," +
            "NVL(ID_INCROCIO,	'') as	 ID_INCROCIO," +
            "NVL(CHIAMATA,	'') as	 CHIAMATA," +
            "NVL(DESC_COMUNE,	'') as	 DESC_COMUNE," +
            "NVL(PALAZZO,	'') as	 PALAZZO," +
            "NVL(SCALA ,	'') as	 SCALA ," +
            "NVL(PIANO ,	'') as	 PIANO ," +
            "NVL(INTERNO,	'') as	 INTERNO," +
            "NVL(NUM_FONOGRAMMA,	'') as	 NUM_FONOGRAMMA," +
            "NVL(NUM_PROTOCOLLO_FONO,	'') as	 NUM_PROTOCOLLO_FONO," +
            "NVL(CIVICO_VICINO,	'') as	 CIVICO_VICINO," +
            "NVL(DATAORA_ARRIVO,	'') as	 DATAORA_ARRIVO," +
            "NVL(DUMMY_SIGLA_PROVENIENZA,	'') as	 DUMMY_SIGLA_PROVENIENZA," +
            "NVL(DUMMY_DATA_EXPORT,	'') as	 DUMMY_DATA_EXPORT," +
            "NVL(DUMMY_NUM_INTERVENTO,	'') as	 DUMMY_NUM_INTERVENTO," +
            "NVL(DUMMY_DATA_INTERVENTO,	'') as	 DUMMY_DATA_INTERVENTO," +
            "NVL(ID_112,	'') as	 ID_112," +
            "NVL(ZONA_EMERGENZA,	'') as	 ZONA_EMERGENZA" +
           " FROM SALAOPER.INTERVENTI_CHIUSI";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAInterventiChiusi ORAIntC = new ORAInterventiChiusi();
                ORAIntC.INTERVENTO = Utility.Utility.GetDBField(dr, "INTERVENTO");
                ORAIntC.DATA_CHIAMATA = Utility.Utility.GetDBField(dr, "DATA_CHIAMATA");
                ORAIntC.ORA_CHIAMATA = Utility.Utility.GetDBField(dr, "ORA_CHIAMATA");
                ORAIntC.DATA_INTERVENTO = Utility.Utility.GetDBField(dr, "DATA_INTERVENTO");
                ORAIntC.ORA_USCITA = Utility.Utility.GetDBField(dr, "ORA_USCITA");
                ORAIntC.TURNO_CHIAMATA = Utility.Utility.GetDBField(dr, "TURNO_CHIAMATA");
                ORAIntC.TURNO_INTERVENTO = Utility.Utility.GetDBField(dr, "TURNO_INTERVENTO");
                ORAIntC.COD_TIPOLOGIA = Utility.Utility.GetDBField(dr, "COD_TIPOLOGIA");
                ORAIntC.DETTAGLIO_TIPOLOGIA = Utility.Utility.GetDBField(dr, "DETTAGLIO_TIPOLOGIA");
                ORAIntC.NOTE_INTERVENTO = Utility.Utility.GetDBField(dr, "NOTE_INTERVENTO");
                ORAIntC.LOC_INDIRIZZO = Utility.Utility.GetDBField(dr, "LOC_INDIRIZZO");
                ORAIntC.LOCALITA = Utility.Utility.GetDBField(dr, "LOCALITA");
                ORAIntC.COD_STRADA = Utility.Utility.GetDBField(dr, "COD_STRADA");
                ORAIntC.NUM_CIVICO = Utility.Utility.GetDBField(dr, "NUM_CIVICO");
                ORAIntC.COD_COMUNE = Utility.Utility.GetDBField(dr, "COD_COMUNE");
                ORAIntC.SIGLA_PROVINCIA = Utility.Utility.GetDBField(dr, "SIGLA_PROVINCIA");
                ORAIntC.RICHIEDENTE = Utility.Utility.GetDBField(dr, "RICHIEDENTE");
                ORAIntC.TELE_NUMERO = Utility.Utility.GetDBField(dr, "TELE_NUMERO");
                ORAIntC.COMANDO = Utility.Utility.GetDBField(dr, "COMANDO");
                ORAIntC.SCHEDA_ALTRO_COMANDO = Utility.Utility.GetDBField(dr, "SCHEDA_ALTRO_COMANDO");
                ORAIntC.NATURA = Utility.Utility.GetDBField(dr, "NATURA");
                ORAIntC.MATRICOLA_OPERATORE_CHIAMATA = Utility.Utility.GetDBField(dr, "MATRICOLA_OPERATORE_CHIAMATA");
                ORAIntC.MATRICOLA_OPERATORE_INTERVENTO = Utility.Utility.GetDBField(dr, "MATRICOLA_OPERATORE_INTERVENTO");
                ORAIntC.STATUS = Utility.Utility.GetDBField(dr, "STATUS");
                ORAIntC.ENTI_INTERVENUTI = Utility.Utility.GetDBField(dr, "ENTI_INTERVENUTI");
                ORAIntC.ORA_CHIUSURA = Utility.Utility.GetDBField(dr, "ORA_CHIUSURA");
                ORAIntC.DATA_CHIUSURA = Utility.Utility.GetDBField(dr, "DATA_CHIUSURA");
                ORAIntC.FLAG_DOC_SN = Utility.Utility.GetDBField(dr, "FLAG_DOC_SN");
                ORAIntC.RICEVUTA_TRASMESSA = Utility.Utility.GetDBField(dr, "RICEVUTA_TRASMESSA");
                ORAIntC.COD_OBIETTIVO = Utility.Utility.GetDBField(dr, "COD_OBIETTIVO");
                ORAIntC.COD_STRADA_INCROCIO = Utility.Utility.GetDBField(dr, "COD_STRADA_INCROCIO");
                ORAIntC.FLAG_CIV_KM = Utility.Utility.GetDBField(dr, "FLAG_CIV_KM");
                ORAIntC.FLAG_AGGIOR = Utility.Utility.GetDBField(dr, "FLAG_AGGIOR");
                ORAIntC.NOME_STRADA = Utility.Utility.GetDBField(dr, "NOME_STRADA");
                ORAIntC.EDGID_STRADA = Utility.Utility.GetDBField(dr, "EDGID_STRADA");
                ORAIntC.NOME_STRADA_INCROCIO = Utility.Utility.GetDBField(dr, "NOME_STRADA_INCROCIO");
                ORAIntC.EDGID_STRADA_INCROCIO = Utility.Utility.GetDBField(dr, "EDGID_STRADA_INCROCIO");
                ORAIntC.COD_PRIORITA = Utility.Utility.GetDBField(dr, "COD_PRIORITA");
                ORAIntC.PROGR_INTERVENTO = Utility.Utility.GetDBField(dr, "PROGR_INTERVENTO");
                ORAIntC.CODICE_PI = Utility.Utility.GetDBField(dr, "CODICE_PI");
                ORAIntC.INTERVENTO_RILEVANTE = Utility.Utility.GetDBField(dr, "INTERVENTO_RILEVANTE");
                ORAIntC.BOSCHI = Utility.Utility.GetDBField(dr, "BOSCHI");
                ORAIntC.CAMPI = Utility.Utility.GetDBField(dr, "CAMPI");
                ORAIntC.STERPAGLIE = Utility.Utility.GetDBField(dr, "STERPAGLIE");
                ORAIntC.X = Utility.Utility.GetDBField(dr, "X");
                ORAIntC.Y = Utility.Utility.GetDBField(dr, "Y");
                ORAIntC.ID_INCROCIO = Utility.Utility.GetDBField(dr, "ID_INCROCIO");
                ORAIntC.CHIAMATA = Utility.Utility.GetDBField(dr, "CHIAMATA");
                ORAIntC.DESC_COMUNE = Utility.Utility.GetDBField(dr, "DESC_COMUNE");
                ORAIntC.PALAZZO = Utility.Utility.GetDBField(dr, "PALAZZO");
                ORAIntC.SCALA = Utility.Utility.GetDBField(dr, "SCALA");
                ORAIntC.PIANO = Utility.Utility.GetDBField(dr, "PIANO");
                ORAIntC.INTERNO = Utility.Utility.GetDBField(dr, "INTERNO");
                ORAIntC.NUM_FONOGRAMMA = Utility.Utility.GetDBField(dr, "NUM_FONOGRAMMA");
                ORAIntC.NUM_PROTOCOLLO_FONO = Utility.Utility.GetDBField(dr, "NUM_PROTOCOLLO_FONO");
                ORAIntC.CIVICO_VICINO = Utility.Utility.GetDBField(dr, "CIVICO_VICINO");
                ORAIntC.DATAORA_ARRIVO = Utility.Utility.GetDBField(dr, "DATAORA_ARRIVO");
                ORAIntC.DUMMY_SIGLA_PROVENIENZA = Utility.Utility.GetDBField(dr, "DUMMY_SIGLA_PROVENIENZA");
                ORAIntC.DUMMY_DATA_EXPORT = Utility.Utility.GetDBField(dr, "DUMMY_DATA_EXPORT");
                ORAIntC.DUMMY_NUM_INTERVENTO = Utility.Utility.GetDBField(dr, "DUMMY_NUM_INTERVENTO");
                ORAIntC.DUMMY_DATA_INTERVENTO = Utility.Utility.GetDBField(dr, "DUMMY_DATA_INTERVENTO");
                ORAIntC.ID_112 = Utility.Utility.GetDBField(dr, "ID_112");
                ORAIntC.ZONA_EMERGENZA = Utility.Utility.GetDBField(dr, "ZONA_EMERGENZA");

                ListaInterventiChiusi.Add(ORAIntC);
            }

            conn.Dispose();
            return ListaInterventiChiusi;
        }

        public List<ORAInterventi> GetListaInterventi(string CodSede)
        {
            List<ORAInterventi> listaInterventi = new List<ORAInterventi>();
            Connessione InfoCon = _dbcontext.GetConnectionFromCodiceSede(CodSede);

            OracleConnection conn = new OracleConnection(InfoCon.ConnectionString);
            conn.Open();
            OracleCommand cmd = new OracleCommand();
            cmd.Connection = conn;

            cmd.CommandText = "select 	" +
            "NVL(INTERVENTO, 0) as INTERVENTO   ," +
            "NVL(DATA_CHIAMATA, '') as DATA_CHIAMATA      ," +
            "NVL(ORA_CHIAMATA, '') as ORA_CHIAMATA ," +
            "NVL(DATA_INTERVENTO, '') as DATA_INTERVENTO ," +
            "NVL(ORA_USCITA, '') as ORA_USCITA   ," +
            "NVL(TURNO_CHIAMATA, '') as TURNO_CHIAMATA     ," +
            "NVL(TURNO_INTERVENTO, '') as TURNO_INTERVENTO ," +
            "NVL(COD_TIPOLOGIA, 0) as COD_TIPOLOGIA      ," +
            "NVL(DETTAGLIO_TIPOLOGIA, '') as DETTAGLIO_TIPOLOGIA   ," +
            "NVL(NOTE_INTERVENTO, '') as NOTE_INTERVENTO ," +
            "NVL(LOC_INDIRIZZO, '') as LOC_INDIRIZZO      ," +
            "NVL(LOCALITA, '') as LOCALITA     ," +
            "NVL(COD_STRADA, '') as COD_STRADA   ," +
            "NVL(NUM_CIVICO, '') as NUM_CIVICO   ," +
            "NVL(COD_COMUNE, 0) as COD_COMUNE   ," +
            "NVL(SIGLA_PROVINCIA, '') as SIGLA_PROVINCIA ," +
            "NVL(RICHIEDENTE, '') as RICHIEDENTE  ," +
            "NVL(TELE_NUMERO, '') as TELE_NUMERO  ," +
            "NVL(COMANDO, '') as COMANDO      ," +
            "NVL(SCHEDA_ALTRO_COMANDO, '') as SCHEDA_ALTRO_COMANDO  ," +
            "NVL(NATURA, '') as NATURA       ," +
            "NVL(MATRICOLA_OPERATORE_CHIAMATA, '') as MATRICOLA_OPERATORE_CHIAMATA      ," +
            "NVL(MATRICOLA_OPERATORE_INTERVENTO, '') as MATRICOLA_OPERATORE_INTERVENTO       ," +
            "NVL(STATUS, '') as STATUS       ," +
            "NVL(ENTI_INTERVENUTI, '') as ENTI_INTERVENUTI ," +
            "NVL(RICEVUTA_TRASMESSA, '') as RICEVUTA_TRASMESSA    ," +
            "NVL(COD_OBIETTIVO, 0) as COD_OBIETTIVO      ," +
            "NVL(COD_STRADA_INCROCIO, '') as COD_STRADA_INCROCIO   ," +
            "NVL(FLAG_CIV_KM, '') as FLAG_CIV_KM  ," +
            "NVL(COD_PRIORITA, '') as COD_PRIORITA ," +
            "NVL(PROGR_INTERVENTO, 0) as PROGR_INTERVENTO ," +
            "NVL(EDGID_STRADA, 0) as EDGID_STRADA ," +
            "NVL(CODICE_PI, 0) as CODICE_PI    ," +
            "NVL(FLAG_DOC_SN, '') as FLAG_DOC_SN  ," +
            "NVL(INTERVENTO_RILEVANTE, '') as INTERVENTO_RILEVANTE  ," +
            "NVL(BOSCHI, 0) as BOSCHI       ," +
            "NVL(CAMPI, 0) as CAMPI        ," +
            "NVL(STERPAGLIE, 0) as STERPAGLIE   ," +
            "NVL(X, 0) as X            ," +
            "NVL(Y, 0) as Y            ," +
            "NVL(ID_INCROCIO, 0) as ID_INCROCIO  ," +
            "NVL(CHIAMATA, 0) as CHIAMATA     ," +
            "NVL(ID_ZONA, 0) as ID_ZONA      ," +
            "NVL(DESC_LUOGO, '') as DESC_LUOGO   ," +
            "NVL(FLAG_R, '') as FLAG_R       ," +
            "NVL(ID_112, 0) as ID_112       ," +
            "NVL(COD_DIST_PREALL, 0) as COD_DIST_PREALL ," +
            "NVL(ZONA_EMERGENZA, '') as ZONA_EMERGENZA     ," +
            "NVL(PALAZZO, '') as PALAZZO      ," +
            "NVL(SCALA, '') as SCALA        ," +
            "NVL(PIANO, '') as PIANO        ," +
            "NVL(INTERNO, '') as INTERNO      ," +
            "NVL(DATAORA_ARRIVO, '') as DATAORA_ARRIVO     ," +
            "NVL(NUM_FONOGRAMMA, '') as NUM_FONOGRAMMA     ," +
            "NVL(NUM_PROTOCOLLO_FONO, '') as NUM_PROTOCOLLO_FONO   ," +
            "NVL(CIVICO_VICINO, '') as CIVICO_VICINO      ," +
            "NVL(DUMMY_SIGLA_PROVENIENZA, '') as DUMMY_SIGLA_PROVENIENZA             ," +
            "NVL(DUMMY_DATA_EXPORT, '') as DUMMY_DATA_EXPORT     ," +
            "NVL(DUMMY_NUM_INTERVENTO, 0) as DUMMY_NUM_INTERVENTO  ," +
            "NVL(DUMMY_DATA_INTERVENTO, '') as DUMMY_DATA_INTERVENTO " +
            "from SALAOPER.INTERVENTI ";

            cmd.CommandType = CommandType.Text;
            OracleDataReader dr = cmd.ExecuteReader();

            while (dr.Read())
            {
                ORAInterventi ORAInt = new ORAInterventi();
                ORAInt.INTERVENTO = Utility.Utility.GetDBField(dr, "INTERVENTO");
                ORAInt.DATA_CHIAMATA = Utility.Utility.GetDBField(dr, "DATA_CHIAMATA");
                ORAInt.ORA_CHIAMATA = Utility.Utility.GetDBField(dr, "ORA_CHIAMATA");
                ORAInt.DATA_INTERVENTO = Utility.Utility.GetDBField(dr, "DATA_INTERVENTO");
                ORAInt.ORA_USCITA = Utility.Utility.GetDBField(dr, "ORA_USCITA");
                ORAInt.TURNO_CHIAMATA = Utility.Utility.GetDBField(dr, "TURNO_CHIAMATA");
                ORAInt.TURNO_INTERVENTO = Utility.Utility.GetDBField(dr, "TURNO_INTERVENTO");
                ORAInt.COD_TIPOLOGIA = Utility.Utility.GetDBField(dr, "COD_TIPOLOGIA");
                ORAInt.DETTAGLIO_TIPOLOGIA = Utility.Utility.GetDBField(dr, "DETTAGLIO_TIPOLOGIA");
                ORAInt.NOTE_INTERVENTO = Utility.Utility.GetDBField(dr, "NOTE_INTERVENTO");
                ORAInt.LOC_INDIRIZZO = Utility.Utility.GetDBField(dr, "LOC_INDIRIZZO");
                ORAInt.LOCALITA = Utility.Utility.GetDBField(dr, "LOCALITA");
                ORAInt.COD_STRADA = Utility.Utility.GetDBField(dr, "COD_STRADA");
                ORAInt.NUM_CIVICO = Utility.Utility.GetDBField(dr, "NUM_CIVICO");
                ORAInt.COD_COMUNE = Utility.Utility.GetDBField(dr, "COD_COMUNE");
                ORAInt.SIGLA_PROVINCIA = Utility.Utility.GetDBField(dr, "SIGLA_PROVINCIA");
                ORAInt.RICHIEDENTE = Utility.Utility.GetDBField(dr, "RICHIEDENTE");
                ORAInt.TELE_NUMERO = Utility.Utility.GetDBField(dr, "TELE_NUMERO");
                ORAInt.COMANDO = Utility.Utility.GetDBField(dr, "COMANDO");
                ORAInt.SCHEDA_ALTRO_COMANDO = Utility.Utility.GetDBField(dr, "SCHEDA_ALTRO_COMANDO");
                ORAInt.NATURA = Utility.Utility.GetDBField(dr, "NATURA");
                ORAInt.MATRICOLA_OPERATORE_CHIAMATA = Utility.Utility.GetDBField(dr, "MATRICOLA_OPERATORE_CHIAMATA");
                ORAInt.MATRICOLA_OPERATORE_INTERVENTO = Utility.Utility.GetDBField(dr, "MATRICOLA_OPERATORE_INTERVENTO");
                ORAInt.STATUS = Utility.Utility.GetDBField(dr, "STATUS");
                ORAInt.ENTI_INTERVENUTI = Utility.Utility.GetDBField(dr, "ENTI_INTERVENUTI");
                ORAInt.RICEVUTA_TRASMESSA = Utility.Utility.GetDBField(dr, "RICEVUTA_TRASMESSA");
                ORAInt.COD_OBIETTIVO = Utility.Utility.GetDBField(dr, "COD_OBIETTIVO");
                ORAInt.COD_STRADA_INCROCIO = Utility.Utility.GetDBField(dr, "COD_STRADA_INCROCIO");
                ORAInt.FLAG_CIV_KM = Utility.Utility.GetDBField(dr, "FLAG_CIV_KM");
                ORAInt.COD_PRIORITA = Utility.Utility.GetDBField(dr, "COD_PRIORITA");
                ORAInt.PROGR_INTERVENTO = Utility.Utility.GetDBField(dr, "PROGR_INTERVENTO");
                ORAInt.EDGID_STRADA = Utility.Utility.GetDBField(dr, "EDGID_STRADA");
                ORAInt.CODICE_PI = Utility.Utility.GetDBField(dr, "CODICE_PI");
                ORAInt.FLAG_DOC_SN = Utility.Utility.GetDBField(dr, "FLAG_DOC_SN");
                ORAInt.INTERVENTO_RILEVANTE = Utility.Utility.GetDBField(dr, "INTERVENTO_RILEVANTE");
                ORAInt.BOSCHI = Utility.Utility.GetDBField(dr, "BOSCHI");
                ORAInt.CAMPI = Utility.Utility.GetDBField(dr, "CAMPI");
                ORAInt.STERPAGLIE = Utility.Utility.GetDBField(dr, "STERPAGLIE");
                ORAInt.X = Utility.Utility.GetDBField(dr, "X");
                ORAInt.Y = Utility.Utility.GetDBField(dr, "Y");
                ORAInt.ID_INCROCIO = Utility.Utility.GetDBField(dr, "ID_INCROCIO");
                ORAInt.CHIAMATA = Utility.Utility.GetDBField(dr, "CHIAMATA");
                ORAInt.ID_ZONA = Utility.Utility.GetDBField(dr, "ID_ZONA");
                ORAInt.DESC_LUOGO = Utility.Utility.GetDBField(dr, "DESC_LUOGO");
                ORAInt.FLAG_R = Utility.Utility.GetDBField(dr, "FLAG_R");
                ORAInt.ID_112 = Utility.Utility.GetDBField(dr, "ID_112");
                ORAInt.COD_DIST_PREALL = Utility.Utility.GetDBField(dr, "COD_DIST_PREALL");
                ORAInt.ZONA_EMERGENZA = Utility.Utility.GetDBField(dr, "ZONA_EMERGENZA");
                ORAInt.PALAZZO = Utility.Utility.GetDBField(dr, "PALAZZO");
                ORAInt.SCALA = Utility.Utility.GetDBField(dr, "SCALA");
                ORAInt.PIANO = Utility.Utility.GetDBField(dr, "PIANO");
                ORAInt.INTERNO = Utility.Utility.GetDBField(dr, "INTERNO");
                ORAInt.DATAORA_ARRIVO = Utility.Utility.GetDBField(dr, "DATAORA_ARRIVO");
                ORAInt.NUM_FONOGRAMMA = Utility.Utility.GetDBField(dr, "NUM_FONOGRAMMA");
                ORAInt.NUM_PROTOCOLLO_FONO = Utility.Utility.GetDBField(dr, "NUM_PROTOCOLLO_FONO");
                ORAInt.CIVICO_VICINO = Utility.Utility.GetDBField(dr, "CIVICO_VICINO");
                ORAInt.DUMMY_SIGLA_PROVENIENZA = Utility.Utility.GetDBField(dr, "DUMMY_SIGLA_PROVENIENZA");
                ORAInt.DUMMY_DATA_EXPORT = Utility.Utility.GetDBField(dr, "DUMMY_DATA_EXPORT");
                ORAInt.DUMMY_NUM_INTERVENTO = Utility.Utility.GetDBField(dr, "DUMMY_NUM_INTERVENTO");
                ORAInt.DUMMY_DATA_INTERVENTO = Utility.Utility.GetDBField(dr, "DUMMY_DATA_INTERVENTO");

                listaInterventi.Add(ORAInt);
            }

            conn.Dispose();
            return listaInterventi;
        }
    }
}
