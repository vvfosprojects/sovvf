namespace Modello.Servizi.CQRS.Queries.GestioneSoccorso.RichiestaAssistenza.ResultDTO
{
    /// <summary>
    ///   Modella il mezzo
    /// </summary>
    public class Mezzo
    {
        public enum Stato { InSede = 0, InViaggio, SulPosto, InRientro, Istituto }

        public enum StatoEfficienza { FuoriUso = 0, Mediocre, Buona, Ottima }

        public enum Livello { Vuoto = 0, Basso, Medio, Alto }

        public enum Appartenenza { Proprio = 0, AltraSede }

        /// <summary>
        ///   Codice
        /// </summary>
        public string Codice { get; set; }

        /// <summary>
        ///   Descrizione
        /// </summary>
        public string Descrizione { get; set; }

        /// <summary>
        ///   Genere. Per es. APS, ABP, AS, CA, ecc.
        /// </summary>
        public string GenereMezzo { get; set; }

        /// <summary>
        ///   Codice dello stato del mezzo. Per es. inSede, inViaggio, sulPosto, inRientro, istituto,
        ///   ecc. Utile a definire il colore del segnale di stato.
        /// </summary>
        public Stato StatoMezzo { get; set; }

        /// <summary>
        ///   Testo del segnale di stato.
        /// </summary>
        public string DescrizioneStato { get; set; }

        /// <summary>
        ///   Codice dello stato di efficienza del mezzo. Utile a definire il colore della
        ///   segnalazione delolo stato di efficienza.
        /// </summary>
        public StatoEfficienza StatoEfficienzaMezzo { get; set; }

        /// <summary>
        ///   Testo dello stato di efficienza
        /// </summary>
        public string DescrizioneStatoEfficienza { get; set; }

        /// <summary>
        ///   Codice del livello di carburante. Utile a definire il colore della segnalazione sul
        ///   livello di carburante.
        /// </summary>
        public Livello LivelloCarburante { get; set; }

        /// <summary>
        ///   Testo del livello di carburante.
        /// </summary>
        public string DescrizioneLivelloCarburante { get; set; }

        /// <summary>
        ///   Codice del livello di estinguente. Utile a definire il colore della segnalazione del
        ///   livello di estinguente.
        /// </summary>
        public Livello LivelloEstinguente { get; set; }

        /// <summary>
        ///   Testo della segnalazione sul livello di estinguente
        /// </summary>
        public string DescrizioneLivelloEstinguente { get; set; }

        /// <summary>
        ///   Codice dello stato di appartenenza del mezzo. Per es. PROPRIO, ALTRASEDE, ecc. Utile a
        ///   definire il colore della segnalazione sullo stato di appartenenza.
        /// </summary>
        public Appartenenza AppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Testo della segnalazione sullo stato di appartenenza.
        /// </summary>
        public string DescrizioneAppartenenzaMezzo { get; set; }

        /// <summary>
        ///   Elenco dei componenti presenti sul mezzo
        /// </summary>
        public Componente[] PersoneSulMezzo { get; set; }

        /// <summary>
        ///   Elenco delle notifiche legate al mezzo
        /// </summary>
        public string[] NotificheMezzo { get; set; }
    }
}
