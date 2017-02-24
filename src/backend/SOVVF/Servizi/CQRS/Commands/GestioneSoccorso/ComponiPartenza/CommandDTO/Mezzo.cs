using System.Collections.Generic;

namespace Modello.Servizi.CQRS.Commands.GestioneSoccorso.ComponiPartenza.CommandDTO
{
    /// <summary>
    ///   Un mezzo che partecipa ad una partenza, con indicazione del conducente e dei componenti a bordo.
    /// </summary>
    public class Mezzo
    {
        /// <summary>
        ///   Il codice del mezzo
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Il codice fiscale del conducente
        /// </summary>
        /// <remarks>Tale codice fiscale appare anche nell'elenco dei componenti a bordo.</remarks>
        public string CodiceFiscaleConducente { get; set; }

        /// <summary>
        ///   I componenti a bordo del mezzo.
        /// </summary>
        public IEnumerable<Componente> Componenti { get; set; }
    }
}
