using System;
using System.Collections.Generic;
using System.Text;

namespace SO115App.Models.Classi.ServiziEsterni.UtenteComune
{
    /// <summary>
    ///   oggetto della sede associata ad una persona fisica del personale in arrivo dal servizio
    ///   Utenti Comuni
    /// </summary>
    public class SedeUC
    {
        /// <summary>
        ///   l'id (codice distaccamento) della sede.
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        ///   la descrizione della sede
        /// </summary>
        public string Descrizione { get; set; }
    }
}
