using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.Condivise
{
    /// <summary>
    ///   classe che contiene i parametri della paginazione
    /// </summary>
    public class Paginazione
    {
        /// <summary>
        ///   pagina corrente
        /// </summary>
        public int Page { get; set; }

        /// <summary>
        ///   elementi contenuti in una singola pagina
        /// </summary>
        public int PageSize { get; set; }

        /// <summary>
        ///   conteggio dei risultati
        /// </summary>
        public int Count { get; set; }

        /// <summary>
        ///   conteggio delle pagine
        /// </summary>
        public int TotalPages => (int)Math.Ceiling(decimal.Divide(Count, PageSize));
    }
}
