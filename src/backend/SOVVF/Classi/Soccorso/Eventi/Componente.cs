using System.Collections.Generic;

namespace Modello.Classi.Soccorso.Eventi
{
    /// <summary>
    ///   Modella il componente di una partenza, con i suoi ruoli, il mezzo sul quale è collocato e
    ///   le attrezzature che ha in carico.
    /// </summary>
    public class Componente
    {
        /// <summary>
        ///   Indica i possibili ruoli con i quali si partecipa ad una partenza.
        /// </summary>
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

        /// <summary>
        ///   E' il codice del mezzo su cui è collocato il componente
        /// </summary>
        public string CodiceMezzo { get; set; }

        /// <summary>
        ///   E' la lista dei ruoli assegnati al soggetto contestualmente alla richiesta in corso
        /// </summary>
        public ISet<Ruolo> Ruoli { get; set; }

        /// <summary>
        ///   E' la lista dei codici delle attrezzature in carico al componente
        /// </summary>
        public IList<string> CodiciAttrezzature { get; set; }
    }
}
