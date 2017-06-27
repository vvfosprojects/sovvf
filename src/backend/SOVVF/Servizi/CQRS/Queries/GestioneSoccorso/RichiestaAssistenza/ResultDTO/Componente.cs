namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.RichiestaAssistenza.ResultDTO
{
    /// <summary>
    ///   Modella il componente di una squadra
    /// </summary>
    public class Componente
    {
        /// <summary>
        ///   La qualifica
        /// </summary>
        public string Qualifica { get; set; }

        /// <summary>
        ///   Il nominativo esteso del componente
        /// </summary>
        public string Nominativo { get; set; }

        /// <summary>
        ///   Il tooltip, utile specialmente per sanare problemi di omonimia
        /// </summary>
        public string Tooltip { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di capopartenza
        /// </summary>
        public bool CapoPartenza { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di autista
        /// </summary>
        public bool Autista { get; set; }

        /// <summary>
        ///   Indicazione del ruolo di rimpiazzo
        /// </summary>
        public bool Rimpiazzo { get; set; }
    }
}
