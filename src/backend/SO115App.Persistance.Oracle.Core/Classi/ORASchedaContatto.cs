using System;

namespace SO115App.Persistence.Oracle.Core.Classi
{
    public class ORASchedaContatto
    {
        public int ID_CONTATTO { get; set; }
        public int ID_SES { get; set; }
        public string NOME { get; set; }
        public string COGNOME { get; set; }
        public string LUOGO_NASC { get; set; }
        public string DATA_NASC { get; set; }
        public string RAG_SOCIALE { get; set; }
        public string TEL_PUBL { get; set; }
        public string TOPONIMO { get; set; }
        public string INDIRIZZO { get; set; }
        public string CIVICO { get; set; }
        public string ADD_INFO { get; set; }
        public string CITTA { get; set; }
        public string DISTRETTO { get; set; }
        public string PROVINCIA { get; set; }
        public string CAP { get; set; }
        public decimal? LAT { get; set; }
        public decimal? LON { get; set; }
        public int ANGOLO { get; set; }
        public int RMAX { get; set; }
        public int RMIN { get; set; }
        public string UM_ANG { get; set; }
        public string UM_DIST { get; set; }
        public DateTime DATA_LOC { get; set; }
        public string UCTOFFSET { get; set; }
        public string SHAPE { get; set; }
        public int START_ANG { get; set; }
        public int STOP_ANG { get; set; }
        public string POLYLINE { get; set; }
        public string LEV_CONF { get; set; }
        public string CID { get; set; }
        public string NOTE_AREU { get; set; }
        public string ALTROENTE_IDSCHEDA { get; set; }
        public string ALTROENTE_NOME { get; set; }
        public DateTime ALTROENTE_DATAINS { get; set; }
        public DateTime ALTROENTE_DATAINVIO { get; set; }
        public int OP_ID { get; set; }
        public string CLI { get; set; }
        public DateTime DATA_RICEZIONE { get; set; }
        public string COMPETENZA { get; set; }
        public DateTime DATA_INS { get; set; }
        public string FORWARDEDTO { get; set; }
        public string INFO_XML { get; set; }
        public string FLG_GESTITA { get; set; }
        public string HIGHPRIORITY { get; set; }
        public string INOLTRO_DA_SO_A { get; set; }
        public DateTime DATA_INOLTRO_DA_SO { get; set; }
        public string NOTE_INTERVENTO { get; set; }
        public string OPERATORE_INVIO_SCHEDA { get; set; }
        public string FLG_INTERNA { get; set; }
        public string RICEVUTA_DA { get; set; }
        public string COD_TIPOLOGIA { get; set; }
        public string SIGLA_SEDE_INVIO { get; set; }
        public string DIFFERIBILE { get; set; }
        public string DESCRIZIONE_TRIAGE { get; set; }
        public string COD_TRIAGE { get; set; }
        public DateTime DATA_MARCATO_DIFFERIBILE { get; set; }
        public string NOTE_MARCATO_DIFFERIBILE { get; set; }
        public string USER_MARCATO_DIFFERIBILE { get; set; }
    }
}
