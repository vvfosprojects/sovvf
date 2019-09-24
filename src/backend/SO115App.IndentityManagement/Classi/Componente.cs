using System;

namespace SO115App.ApiIndentityManagement
{
    public class Componente
    {
        /// <summary>
        ///   Descrizione codice fiscale Componente
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Descrizione breve qualifica Componente
        /// </summary>
        public string DescrizioneQualifica { get; set; }

        /// <summary>
        ///   Descrizione lunga qualifica Componente
        /// </summary>
        public string DescrizioneQualificaLunga { get; set; }

        public string CodiceTurno { get; set; }

        /// <summary>
        ///   Nominativo Componente
        /// </summary>
        public string Nominativo { get; set; }
    }
}
