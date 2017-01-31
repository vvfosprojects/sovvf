using System.Collections.Generic;

namespace Modello.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Modella il componente di una partenza, con i suoi ruoli ed il mezzo sul quale è collocato.
    /// </summary>
    public class Componente
    {
        public enum Ruolo
        {
            /// <summary>
            ///   E' il ruolo del capoPartenza
            /// </summary>
            CapoPartenza,

            /// <summary>
            ///   E' il ruolo dell'autista
            /// </summary>
            Autista,

            /// <summary>
            ///   E' il ruolo base che non implica mansioni speciali
            /// </summary>
            Vigile
        }

        /// <summary>
        ///   E' il codice fiscale del membro appartenente alla partenza
        /// </summary>
        public string CodiceFiscale { get; set; }

        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   E' la lista dei ruoli assegnati al soggetto contestualmente alla richiesta in corso
        /// </summary>
        public IList<Ruolo> Ruoli { get; set; }
    }
}
