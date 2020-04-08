namespace SO115App.ApiGac.Models
{
    public class Sede
    {
        /// <summary>
        ///   Codice Sede
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione Sede
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Coordinate
        /// </summary>
        public Coordinate Coordinate { get; set; }

        /// <summary>
        ///   Indirizzo della Sede
        /// </summary>
        public string Indirizzo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        public string Tipo { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        public string Regione { get; set; }

        /// <summary>
        ///   Tipologia Sede
        /// </summary>
        public string Provincia { get; set; }

        /// <summary>
        ///   Label
        /// </summary>
        public string Label { get; set; }

        /// <summary>
        ///   Icona
        /// </summary>
        public string Icona { get; set; }
    }
}
