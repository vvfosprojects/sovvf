namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.RichiestaAssistenza.ResultDTO
{
    /// <summary>
    ///   Modella il mezzo
    /// </summary>
    public class Mezzo
    {
        /// <summary>
        ///   Codice
        /// </summary>
        public string codice { get; set; }

        /// <summary>
        ///   Descrizione
        /// </summary>
        public string descrizione { get; set; }

        /// <summary>
        ///   Genere. Per es. APS, ABP, AS, CA, ecc.
        /// </summary>
        public string genereMezzo { get; set; }

        /// <summary>
        ///   Codice dello stato del mezzo. Per es. inSede, inViaggio, sulPosto, inRientro, istituto,
        ///   disimpegnato, ecc. Utile a definire il colore del segnale di stato.
        /// </summary>
        public string codiceStato { get; set; }

        /// <summary>
        ///   Testo del segnale di stato.
        /// </summary>
        public string descrizioneStato { get; set; }

        /// <summary>
        ///   Codice dello stato di efficienza del mezzo. Utile a definire il colore della
        ///   segnalazione delolo stato di efficienza.
        /// </summary>
        public string codiceStatoEfficienza { get; set; }

        /// <summary>
        ///   Testo dello stato di efficienza
        /// </summary>
        public string descrizioneStatoEfficienza { get; set; }

        /// <summary>
        ///   Codice del livello di carburante. Utile a definire il colore della segnalazione sul
        ///   livello di carburante.
        /// </summary>
        public string codiceLivelloCarburante { get; set; }

        /// <summary>
        ///   Testo del livello di carburante.
        /// </summary>
        public string descrizioneLivelloCarburante { get; set; }

        /// <summary>
        ///   Codice del livello di estinguente. Utile a definire il colore della segnalazione del
        ///   livello di estinguente.
        /// </summary>
        public string codiceLivelloEstinguente { get; set; }

        /// <summary>
        ///   Testo della segnalazione sul livello di estinguente
        /// </summary>
        public string descrizioneLivelloEstinguente { get; set; }

        /// <summary>
        ///   Codice dello stato di appartenenza del mezzo. Per es. PROPRIO, ALTRASEDE, ecc. Utile a
        ///   definire il colore della segnalazione sullo stato di appartenenza.
        /// </summary>
        public string codiceAppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Testo della segnalazione sullo stato di appartenenza.
        /// </summary>
        public string descrizioneAppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Elenco dei componenti presenti sul mezzo
        /// </summary>
        public Componente[] personeSulMezzo { get; set; }

        /// <summary>
        ///   Elenco delle notifiche legate al mezzo
        /// </summary>
        public string[] notificheMezzo { get; set; }
    }
}
