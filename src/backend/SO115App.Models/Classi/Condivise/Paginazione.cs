﻿using System;

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
        public int PageSize { get; set; } = 10;

        /// <summary>
        ///   conteggio dei risultati
        /// </summary>
        public int TotalItems { get; set; }

        /// <summary>
        ///   conteggio delle pagine
        /// </summary>
        public int  TotalPages => (int)Math.Ceiling(decimal.Divide(TotalItems, PageSize));
    }
}
