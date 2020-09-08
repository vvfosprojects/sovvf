using System;
using System.ComponentModel.DataAnnotations;

namespace SO115App.Models.Classi.Condivise
{
    public class CambioStato
    {
        //[Required]
        public DateTime DataOraAggiornamento { get; set; }
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
            ///   La partenza è stata creata ma il mezzo non è ancora uscito dalla sede
            /// </summary>
            InUscita,

            Rientrato
        }
    }
}
