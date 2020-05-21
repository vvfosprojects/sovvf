
namespace SO115App.Persistence.Oracle.Core.Classi
{
    public class ORAAutomezzi
    {
        public int COD_AUTOMEZZO { get; set; }
        public string COD_GENERE_MEZZO { get; set; }
        public string COD_MODELLO_MEZZO { get; set; }
        public string CASA_COSTRUTTRICE { get; set; }
        public int COD_DISTACCAMENTO { get; set; }
        public string DISTACCAMENTO { get; set; }
        public string COD_DESTINAZIONE { get; set; }
        public string SEZIONE { get; set; }
        public string TARGA { get; set; }
        public string SIGLA { get; set; }
        public string STATO { get; set; }
        public int PRIORITA_DIST { get; set; }
        public int PRIORITA_COMANDO { get; set; }
        public string COD_CHIAMATA_SELETTIVA { get; set; }
        public string MEZZO_GPS { get; set; }
        public string FLAG_OPER { get; set; }
        public string NOTE { get; set; }
        public string NUM_SEZ_OPER { get; set; }
        public string TIPO_MEZZO { get; set; }
        public int COD_FORNITORE { get; set; }
        public string COD_COMANDO { get; set; }
        public string MOV_ISTITUTO { get; set; }
        public string FONTE { get; set; }
        public string UTENTE { get; set; }
        public string DISPOSITIVO_GPS_ATTIVO { get; set; }
        public string DESC_DESTINAZIONE { get; set; }   //DESC_DESTINAZIONE DELLA TABELLA DESTINAZIONE_MEZZI
    }
}
