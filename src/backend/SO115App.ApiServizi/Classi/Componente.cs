using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SO115App.ApiServizi.Classi
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

        public DateTime OrarioInizio { get; set; }

        public DateTime OrarioFine { get; set; }

        ///// <summary>
        /////   Indica se il Componente è un capo Partenza
        ///// </summary>
        //public bool CapoPartenza { get; set; }

        ///// <summary>
        /////   Indica se è un autista
        ///// </summary>
        //public bool Autista { get; set; }

        ///// <summary>
        /////   Indica se il componente è un rimpiazzo
        ///// </summary>
        //public bool Rimpiazzo { get; set; }

        ///// <summary>
        /////   Indica se il componente è un funzionario di guardia
        ///// </summary>
        //public bool FunGuardia { get; set; }

        ///// <summary>
        /////   Indica se il componente è un tecnino di guardia 1
        ///// </summary>
        //public bool TecnicoGuardia1 { get; set; }

        ///// <summary>
        /////   Indica se il componente è un tecnico di guardia 2
        ///// </summary>
        //public bool TecnicoGuardia2 { get; set; }

        ///// <summary>
        /////   Indica se il componente è un capoturno
        ///// </summary>
        //public bool CapoTurno { get; set; }
    }
}
