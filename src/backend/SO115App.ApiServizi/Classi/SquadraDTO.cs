using System;
using System.Collections.Generic;

namespace SO115App.ApiServizi.Classi
{
    public class SquadraDTO
    {
        /// <summary>
        ///   Enumera gli stati in cui un capopartenza partecipante ad una richiesta può trovarsi
        /// </summary>
        public enum StatoSquadra
        {
            /// <summary>
            ///   In viaggio verso il luogo del sinistro.
            /// </summary>
            InSede,

            /// <summary>
            ///   Giunta sul luogo del sinistro
            /// </summary>
            InRientro,

            /// <summary>
            ///   In viaggio verso la sede di servizio
            /// </summary>
            InViaggio,

            /// <summary>
            ///   Presso la sede di servizio
            /// </summary>
            SulPosto,

            /// <summary>
            ///   Fuori per ragioni di istituto
            /// </summary>
            Istituto
        }

        public string Codice { get; set; }

        /// <summary>
        ///   Nominativo Squadra
        /// </summary>
        public string Nome { get; set; }

        /// <summary>
        ///   Lo stato della squadra
        /// </summary>
        public StatoSquadra Stato { get; set; }

        /// <summary>
        ///   Lista dei componenti della squadra
        /// </summary>
        public string[] ListaCodiciFiscaliComponentiSquadra { get; set; }

        /// <summary>
        ///   Indica il distaccamento della squadra
        /// </summary>
        public string CodiceSede { get; set; }

        /// <summary>
        ///   Indica l'istante in cui la squadra termina il suo impegno
        /// </summary>
        public DateTime? IstanteTermineImpegno { get; set; }
    }
}
