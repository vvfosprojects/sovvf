namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO
{
    /// <summary>
    ///   E' il componente di una partenza, con indicazione dell'eventuale ruolo di capo-partenza.
    /// </summary>
    public class Componente
    {
        /// <summary>
        ///   Il codice fiscale del componente
        /// </summary>
        public string CodiceFiscale { get; set; }

        /// <summary>
        ///   Indica se è capo-partenza o meno
        /// </summary>
        public bool CapoPartenza { get; set; }
    }
}
