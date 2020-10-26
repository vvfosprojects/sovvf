using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.ExternalAPI.Fake.Classi.DTOFake
{
    public class ComponenteSquadraFake
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

        /// <summary>
        ///   Ruolo ricoperto dall'operatore nel turno indicato
        /// </summary>
        public string Ruolo { get; set; }

        /// <summary>
        ///   Nominativo Componente
        /// </summary>

        public DateTime OrarioInizio { get; set; }

        public DateTime OrarioFine { get; set; }

        /// <summary>
        ///   ToolTip Componente
        /// </summary>
        public string Tooltip { get; set; }

        /// <summary>
        ///   Indica se il Componente è un capo Partenza
        /// </summary>
        public bool CapoPartenza { get; set; }

        /// <summary>
        ///   Indica se è un autista
        /// </summary>
        public bool Autista { get; set; }

        /// <summary>
        ///   Indica se il componente è un rimpiazzo
        /// </summary>
        public bool Rimpiazzo { get; set; }

        /// <summary>
        ///   Indica se il componente è un funzionario di guardia
        /// </summary>
        public bool FunGuardia { get; set; }

        /// <summary>
        ///   Indica se il componente è un tecnino di guardia 1
        /// </summary>
        public bool TecnicoGuardia1 { get; set; }

        /// <summary>
        ///   Indica se il componente è un tecnico di guardia 2
        /// </summary>
        public bool TecnicoGuardia2 { get; set; }

        /// <summary>
        ///   Indica se il componente è un capoturno
        /// </summary>
        public bool CapoTurno { get; set; }

        /// <summary>
        ///   descrive il numero di telefono del componente
        /// </summary>
        public string Telefono { get; set; }
    }
}
