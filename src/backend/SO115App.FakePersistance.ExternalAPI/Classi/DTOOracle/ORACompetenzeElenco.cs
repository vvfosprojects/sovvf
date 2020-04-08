using System;

namespace SO115App.ExternalAPI.Fake.Classi.DTOOracle
{
    public class ORACompetenzeElenco
    {
        public ORACompetenzeElenco()
        {
        }

        /// <SUMMARY>CAMPO ID_ZONA DELLA TABELLA COMPETENZE_ELENCO</SUMMARY>
        public decimal ID_ZONA { get; set; }

        /// <SUMMARY>CAMPO COD_DISTACCAMENTO DELLA TABELLA COMPETENZE_ELENCO</SUMMARY>
        public decimal COD_DISTACCAMENTO { get; set; }

        /// <SUMMARY>CAMPO PRIORITA DELLA TABELLA COMPETENZE_ELENCO</SUMMARY>
        public decimal PRIORITA { get; set; }

        /// <SUMMARY CAMPO FLG_ATTIVO DELLA TABELLA COMPETENZE_ELENCO </SUMMARY>
        public decimal FLG_ATTIVO { get; set; }

        /// <SUMMARY>CAMPO ID_TIPOLOGIA DELLA TABELLA COMPETENZE_ELENCO</SUMMARY>
        public decimal ID_TIPOLOGIA { get; set; }

        /// <SUMMARY>CAMPO ORDINE_COMP DELLA TABELLA COMPETENZE_ELENCO</SUMMARY>
        public decimal ORDINE_COMP { get; set; }
    }
}
