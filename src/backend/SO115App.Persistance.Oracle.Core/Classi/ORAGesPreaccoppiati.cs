
namespace SO115App.Persistence.Oracle.Core.Classi
{
    public class ORAGesPreaccoppiati
    {
        /// <summary>
        ///   CAMPO COD_SQUADRA DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public decimal COD_SQUADRA { get; set; }

        /// <summary>
        ///   CAMPO COD_AUTOMEZZO DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public decimal COD_AUTOMEZZO { get; set; }

        /// <summary>
        ///   CAMPO CMOB_PARTENZA DELLA TABELLA GES_PREACCOPPIATI
        /// </summary>
        public string CMOB_PARTENZA { get; set; }

        /// <summary>
        ///   CAMPO COD_DISTACCAMENTO DELLA TABELLA AUTOMEZZI (estratta in join con
        ///   AUTOMEZZI.COD_AUTOMEZZO = GES_PREACCOPPIATI.COD_AUTOMEZZO)
        /// </summary>
        public decimal COD_DISTACCAMENTO { get; set; }

        /// <summary>
        ///   CAMPO COD_COMANDO DELLA TABELLA AUTOMEZZI (estratta in join con
        ///   AUTOMEZZI.COD_AUTOMEZZO = GES_PREACCOPPIATI.COD_AUTOMEZZO)
        /// </summary>
        public string COD_COMANDO { get; set; }

        /// <summary>
        ///   CAMPO TARGA DELLA TABELLA AUTOMEZZI (estratta in join con AUTOMEZZI.COD_AUTOMEZZO = GES_PREACCOPPIATI.COD_AUTOMEZZO)
        /// </summary>
        public string TIPO_MEZZO { get; set; }

        /// <summary>
        ///   CAMPO TIPO_MEZZO DELLA TABELLA AUTOMEZZI (estratta in join con AUTOMEZZI.COD_AUTOMEZZO
        ///   = GES_PREACCOPPIATI.COD_AUTOMEZZO)
        /// </summary>
        public string TARGA_MEZZO { get; set; }
    }
}
